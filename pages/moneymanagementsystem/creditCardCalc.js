


class Debt {
    // Creates the Debt class
    constructor(name, balanceRemaining, minPayment, dueDate, interest = 0) {
        this.name = name;
        this.balanceRemaining = Math.ceil(balanceRemaining);
        this.minPayment = Math.ceil(minPayment);
        this.dueDate = dueDate;
        this.interest = interest;
        this.init();
    };

    // pushes the debt to the debtList array
    init = function () {
        debtList.push(this)
    }
}

const debtList = [];



// INITIATE DEBTS HERE
let wellsFargo = new Debt();