const path = require('path'),
    userPolicy = require(path.resolve('./modules/users/users.policy')),
    transactionController = require(path.resolve('./modules/transactions/transactions.controller'));

module.exports = function (app) {

    //To Deposit Balance
    app.patch("/balanceDeposit", userPolicy.isLoggedIn, transactionController.deposit);

    //To Withdraw Balance
    app.patch("/balanceWithdraw", userPolicy.isLoggedIn, transactionController.withdraw);

    //For Balance Enquiry
    app.get("/balanceEnquiry", userPolicy.isLoggedIn, transactionController.enquiry);

    //To Download CSV File Of Any Users Transaction Within A Certain Timeline
    app.post("/transactionDownload", userPolicy.isLoggedIn, transactionController.enquiry);
};