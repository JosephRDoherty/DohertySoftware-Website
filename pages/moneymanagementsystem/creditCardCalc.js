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

    // pushes the debt to the debtList array
    init = function () {
        debtList.push(this);
        debtListByMinPayment.push(this);
        debtListByRatio.push(this);
    }
}

const debtList = [];
const debtListByMinPayment = [];
const debtListByRatio = [];


// INITIATE DEBTS HERE
let chaseCard = new Debt("Chase Card", 477.42, 55);
let creditOne = new Debt("Credit One", 380.94, 30);
let phone = new Debt("Joe's Phone", 711, 22.22);
let wellsFargo = new Debt("Wells Fargo", 1287.25, 39);
let capitalOne = new Debt("Capital One 1", 640.46, 25);
let capitalTwo = new Debt("Capital One 2", 579.23, 25);
let jCareCredit = new Debt("Joe's Care Credit", 479.63, 57);
let eCareCredit = new Debt("Elizabeth's Care Credit", 555.76, 30);
let jPaypal = new Debt("Joe's Paypal", 2081.22, 66);
let ePaypal = new Debt("Elizabeth's Paypal", 2428.13, 76);
let xbox = new Debt("Xbox", 279.84, 35);
let fortiva = new Debt("Fortiva Card", 556.71, 58);
let affirm1 = new Debt("Affirm 1", 22.57, 22.57);
let jUpstart = new Debt("Joe's Upstart", 2118.61, 194.54);
let eUpstart = new Debt("Elizabeth's Upstart", 5179.16, 213.05);
let rings = new Debt("Rings", 162.28, 39);
let homeDepotCard = new Debt("Home Depot Card", 442.37, 34);
let affirm2 = new Debt("Affirm 2", 69.88, 23.30);
let taxes = new Debt("Back Taxes", 282.79, 35);

sortByBalance(debtList);
sortByMinPayment(debtListByMinPayment);
sortByRatio(debtListByRatio); 
// This ratio compares difficulty to pay off, with impact to cash flow.
// Larger number means it's easier to pay off and will have the most positive impact on cash flow.
// If two debts have the same balance, but A has a larger minimum payment than B, A will rank higher
// If two debts have the same minimum payment, but A has a larger balance than B, B will rank higher


function payDumpCalc(cash, array=debtListByRatio){
    // Calculates the best cards to pay off to improve cash flow, given a fixed cash amount.
    let totalCost = 0;
    let totalMin = 0;
    const payArray = [];
    for(let i=0; i<array.length; i++){
        totalCost += array[i].balanceRemaining;
        totalMin += array[i].minPayment;
        payArray.push(array[i]);
        console.log(totalMin, totalCost)
        if(totalCost >= cash){
            console.log(totalMin, totalCost)
            break;
        }
    }

    return payArray;

}

function ratioCalc(a, b){
    return b / a;
}

function sortByBalance(array){
    // Sorts a debt array by balance remaining [DEFAULT SORT]
    function compareBalance(a, b){
        return a.balanceRemaining - b.balanceRemaining;
    }

    array.sort(compareBalance);

}

function sortByMinPayment(array){
    // Sorts a debt array by min payment
    function compareMinPayment(a, b){
        return a.minPayment - b.minPayment;
    }

    array.sort(compareMinPayment);
}

function sortByRatio(array){
    // Sorts a debt array by min payment
    function compareRatio(a, b){
        return b.balToMinRatio - a.balToMinRatio;
    }

    array.sort(compareRatio);
}


console.log(payDumpCalc(2174.27));
