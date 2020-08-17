const path = require('path'),
    userPolicy = require(path.resolve('./modules/users/users.policy')),
    transactionController = require(path.resolve('./modules/transactions/transactions.controller'));

module.exports = function (app) {

    //to deposit balance
    app.patch("/balanceDeposit", userPolicy.isLoggedIn, transactionController.deposit);

    //to withdraw balance
    app.patch("/balanceWithdraw", userPolicy.isLoggedIn, transactionController.withdraw);

    //for balance enquiry
    app.get("/balanceEnquiry", userPolicy.isLoggedIn, transactionController.balanceEnquiry);

    //to download csv file of any users transaction within a certain timeline
    app.post("/transactionDownload", userPolicy.isLoggedIn, userPolicy.isManager, transactionController.transactionDownload);
};