// CREDIT CARD MANAGEMENT SYSTEM
// Not sure if this will be a tab on the MMS or a separate page.
// Probably a tab.
// annoyingly 2 js files can't talk to eachother without Node.js or some other thing,
// so they will have to only talk through the HTML if necessary
// I'm hoping they won't need to communicate directly


class Debt {
    // Creates the Debt class
    constructor(name, balanceRemaining, minPayment) {
        this.name = name;
        this.balanceRemaining = Math.ceil(balanceRemaining);
        this.minPayment = Math.ceil(minPayment);
        this.balToMinRatio = ratioCalc(balanceRemaining, minPayment);
        this.init();
    };

    // pushes the debt to the debtList arrays
    init = function () {
        debtList.push(this);
        debtListByMinPayment.push(this);
        debtListByRatio.push(this);
    }
}

// initialize debtLists
const debtList = [];
const debtListByMinPayment = [];
const debtListByRatio = [];


// INITIATE DEBTS HERE
//let chaseCard = new Debt("Chase Card", 477.42, 55); //PAID OFF!!!!!
//let creditOne = new Debt("Credit One", 380.94, 30); //PAID OFF!!!!!
let phone = new Debt("Joe's Phone", 711, 22.22);
let wellsFargoCard = new Debt("Wells Fargo", 1287.25, 39);
let capitalOne = new Debt("Capital One 1", 640.46, 25);
let capitalTwo = new Debt("Capital One 2", 579.23, 25);
//let jCareCredit = new Debt("Joe's Care Credit", 479.63, 57); //PAID OFF!!!!!
let eCareCreditCard = new Debt("Elizabeth's Care Credit", 555.76, 30);
let jPaypal = new Debt("Joe's Paypal", 2081.22, 66);
let ePaypal = new Debt("Elizabeth's Paypal", 2428.13, 76);
//let xbox = new Debt("Xbox", 279.84, 35); //PAID OFF!!!!!
let fortiva = new Debt("Fortiva Card", 556.71, 58);
//let affirm1 = new Debt("Affirm 1", 22.57, 22.57); //PAID OFF!!!!!
let jUpstartDebt = new Debt("Joe's Upstart", 2118.61, 194.54);
let eUpstartDebt = new Debt("Elizabeth's Upstart", 5179.16, 213.05);
//let rings = new Debt("Rings", 162.28, 39); //PAID OFF!!!!!
let homeDepotCard = new Debt("Home Depot Card", 442.37, 34);
//let affirm2 = new Debt("Affirm 2", 69.88, 23.30); //PAID OFF!!!!!
//let taxes = new Debt("Back Taxes", 282.79, 35); //PAID OFF!!!!!

// debtLists, sorted
sortByBalance(debtList);
sortByMinPayment(debtListByMinPayment);
sortByRatio(debtListByRatio);
// This ratio compares difficulty to pay off, with impact to cash flow.
// Larger number means it's easier to pay off and will have the most positive impact on cash flow.
// If two debts have the same balance, but A has a larger minimum payment than B, A will rank higher
// If two debts have the same minimum payment, but A has a larger balance than B, B will rank higher


function payDumpCalc(cash, array = debtListByRatio, buffer = 100) {
    // Calculates the best cards to pay off to improve cash flow, given a fixed cash amount.
    // This is being used by lumpSumCalc(), which uses multiple versions of this function to find the best algorithm

    let totalCost = 0;
    let totalMin = 0;
    const payArray = [];
    for (let i = 0; i < array.length; i++) {
        totalCost += array[i].balanceRemaining;
        totalMin += array[i].minPayment;
        payArray.push(array[i]);

        if (totalCost > cash + buffer) {
            // if we've over spent, remove that last option, and then find the closestMatch
            totalCost -= array[i].balanceRemaining;
            totalMin -= array[i].minPayment;
            payArray.pop();

            let remaining = cash - totalCost;

            let closestMatch = findCloseMatch(remaining, payArray);

            if (closestMatch) {
                payArray.push(closestMatch);

                totalCost += closestMatch.balanceRemaining;
                totalMin += closestMatch.minPayment;
            }
            break;

        }
    }
    // return an object so we can keep all of this data
    return {
        debts: payArray,
        totalCost: totalCost,
        totalMin: totalMin
    };
}

function payDumpCalcReverse(cash, buffer = 100, array = debtList) {
    const reverseArray = [...array].reverse();

    let totalCost = 0;
    let totalMin = 0;

    const payArray = [];
    for (let i = 0; i < reverseArray.length; i++) {
        // Check if the total cost + balance of current debt is <= cash + buffer
        if ((totalCost + reverseArray[i].balanceRemaining) < (cash + buffer)) {
            // if true, add it.
            totalCost += reverseArray[i].balanceRemaining;
            totalMin += reverseArray[i].minPayment;
            payArray.push(reverseArray[i]);
        } else {
            continue;
        }
        if (totalCost > (cash + buffer)) {
            totalCost -= array[i].balanceRemaining;
            totalMin -= array[i].minPayment;
            payArray.pop();

            let remaining = cash - totalCost;

            let closestMatch = findCloseMatch(remaining, payArray);
            // if it returns something, push it
            if (closestMatch) {
                payArray.push(closestMatch);

                totalCost += closestMatch.balanceRemaining;
                totalMin += closestMatch.minPayment;
            }
            break;
        }
    }

    // return an object so we can keep all of this data
    return {
        debts: payArray,
        totalCost: totalCost,
        totalMin: totalMin
    };
}



function lumpSumCalc(num, buffer) {
    // Uses 3 different algorithms to determine amount to pay off
    // byBalance and byRatio are usually the best
    // byMinPayment is mostly useless but there may be edge cases where it's useful
    // I think byMinPayment could actually be improved, but it would need to use a whole different function


    let byRatio = payDumpCalc(num, debtListByRatio, buffer);
    let byBalance = payDumpCalc(num, debtList, buffer);
    let byBalanceReverse = payDumpCalcReverse(num, buffer);
    let byMinPayment = payDumpCalc(num, debtListByMinPayment, buffer);

    console.log(`Using ratio: ${byRatio.totalCost} | ${byRatio.totalMin}`, byRatio.debts);
    console.log(`Using balance: ${byBalance.totalCost} | ${byBalance.totalMin}`, byBalance.debts);
    console.log(`Using balance REVERSE: ${byBalanceReverse.totalCost} | ${byBalanceReverse.totalMin}`, byBalanceReverse.debts);
    console.log(`Using minimum payment: ${byMinPayment.totalCost} | ${byMinPayment.totalMin}`, byMinPayment.debts);

}

function findCloseMatch(num, currentArray, array = debtListByRatio) {
    // attempts to find the debt that can be paid with the remaining money
    const potentials = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].balanceRemaining <= num) {
            // check for duplicates
            if (!currentArray.includes(array[i])) {
                potentials.push(array[i]);
            }
        }
    }
    sortByBalance(potentials);
    return potentials[0];
}

function ratioCalc(a, b) {
    // simple ratio calculator, seems like this should be built in to js
    return b / a;
}

function sortByBalance(array) {
    // Sorts a debt array by balance remaining [DEFAULT SORT]
    function compareBalance(a, b) {
        return a.balanceRemaining - b.balanceRemaining;
    }

    array.sort(compareBalance);

}

function sortByMinPayment(array) {
    // Sorts a debt array by min payment
    function compareMinPayment(a, b) {
        return a.minPayment - b.minPayment;
    }

    array.sort(compareMinPayment);
}

function sortByRatio(array) {
    // Sorts a debt array by min payment
    function compareRatio(a, b) {
        return b.balToMinRatio - a.balToMinRatio;
    }

    array.sort(compareRatio);
}

function costPerMonth(array=debtList){
    let costPerMonth = 0;
    for(let i=0; i<array.length; i++){
        costPerMonth += array[i].minPayment;
    }

    return costPerMonth;
}

function totalBalance(array=debtList){
    let totalBalance = 0;
    for(let i=0; i<array.length; i++){
        totalBalance += array[i].balanceRemaining;
    }
    return totalBalance;
}


lumpSumCalc(500, 0)



// Tabs:
//      Debt List with sorting functionality
//      lumpSumCalc display with lump sum input option
//      debt stats tab


// =================================================================================================================================================
//                                                      EVENT LISTENERS
// =================================================================================================================================================

// Nav button

var activeDebtTab = {
    divID: null,
    indicator: null,
    indicatorOffClass: null,
    indicatorOnClass: null,
}

// debtTabs
const HTMLdebtStats = getID("debtStats");
HTMLdebtStats.addEventListener("click", function () { showDiv("debtStatsDropdown", "debtStats", null, "debtTabsActive", activeDebtTab) });

const HTMLlumpSum = getID("lumpSum");
HTMLlumpSum.addEventListener("click", function () { showDiv("lumpSumDropdown", "lumpSum", null, "debtTabsActive", activeDebtTab) });

const HTMLdebtList = getID("debtList");
HTMLdebtList.addEventListener("click", function () { showDiv("debtListDropdown", "debtList", null, "debtTabsActive", activeDebtTab) });

//===========================
//      debtDropdowns
//===========================
// Debt Stats
const HTMLdebtStatsDropdown = getID("debtStatsDropdown");
const HTMLcostPerMonth = getID("costPerMonth");
HTMLcostPerMonth.innerHTML = costPerMonth();
const HTMLtotalBalance = getID("totalBalance");
HTMLtotalBalance.innerHTML = totalBalance();
const HTMLnumOfDebts = getID("numOfDebts");
HTMLnumOfDebts.innerHTML = debtList.length;

// lump Sum calc
const HTMLlumpSumDropdown = getID("lumpSumDropdown");


// debt list 
const HTMLdebtListDropdown = getID("debtListDropdown");

const HTMLdebtSortCarot = getID("debtSortCarot");
HTMLdebtSortCarot.addEventListener("click", function () {changeClass("debtSortCarot", "fa-caret-up", "fa-caret-down")})

const HTMLsortBy = getID("sortBy");
//HTMLsortBy.addEventListener("click", )




