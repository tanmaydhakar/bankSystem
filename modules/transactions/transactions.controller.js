const path = require("path"),
    mongoose = require('mongoose'),
    Transaction = mongoose.model("Transaction"),
    User = mongoose.model("User"),
    Constants = require(path.resolve('./modules/core/constants.controller')).constants,
    MailController = require(path.resolve('./modules/core/mail.controller')),
    Utility = require(path.resolve("./modules/core/utility.controller"));

//To deposit balance in users account
const deposit = function (req, res) {
    if (!req.body || !req.user || !req.body.amount || typeof req.body.amount != "number") {
        return res.status(400).send("Bad request");
    }
    if (req.body.amount <= 0) {
        return res.status(400).send("Deposit amount cant be less than or equal to zero.");
    }
    const user = req.user._id,
        amount = req.body.amount;

    User.findOneAndUpdate({
        "_id": user
    }, {
        "$inc": {
            "balance": amount
        }
    }, {
        "new": true
    }, function (err, result) {
        if (err) {
            return res.status(500).send("Error occured");
        }
        req.body.type = Constants.TRANSACTION_TYPE[0],
            req.body.userData = result;
        createUserTransaction(req, res);
        MailController.sendTransactionMail(req, res);
        return res.status(202).send("Deposit successfull");
    });
}

//To withdraw balance from users account
const withdraw = function (req, res) {
    if (!req.body || !req.user || !req.body.amount || typeof req.body.amount != "number") {
        return res.status(400).send("Bad request");
    }
    if (req.body.amount <= 0) {
        return res.status(400).send("Withdraw amount cant be less than equal to zero.");
    }
    const user = req.user._id,
        amount = req.body.amount;

    User.findOne({
        "_id": user
    }, function (err, userData) {
        if (err) {
            return res.status(500).send("Error occured");
        }
        if (userData.balance < amount) {
            return res.status(422).send("You dont have enough balance to withdraw.");
        } else {
            User.findOneAndUpdate({
                "_id": user
            }, {
                "$inc": {
                    "balance": -amount
                }
            }, {
                "new": true
            }, function (err, result) {
                if (err) {
                    return res.status(500).send("Error occured");
                }
                req.body.type = Constants.TRANSACTION_TYPE[1];
                req.body.userData = result;
                createUserTransaction(req, res);
                MailController.sendTransactionMail(req, res);
                return res.status(202).send("Withdraw successfull");
            })
        }
    });
}

//To store users transaction detail's in database
const createUserTransaction = function (req, res) {
    return new Promise((resolve, reject) => {

        const transactionData = {
            user: req.user._id,
            type: req.body.type,
            amount: req.body.amount
        }

        Transaction.create(transactionData, function (err, result) {
            if (err) {
                console.log(err, new Date());
                return reject(err);
            } else {
                return resolve();
            }
        })
    });
}

//For balance enquiry
const balanceEnquiry = function (req, res) {
    const user = req.user._id;
    User.findOne({
        "_id": user
    }, {
        "_id": 0,
        "balance": 1
    }, function (err, userBalance) {
        if (err) {
            console.log(err, new Date);
            return res.status(500).send("Error occured");
        } else {
            const balance = {};
            balance["balance"] = userBalance["balance"];
            return res.status(200).send(balance);
        }
    });
}

//To download csv file of any users transaction within a certain timeline
const transactionDownload = function (req, res) {
    if (!req.body.userIds || !Array.isArray(req.body.userIds) || !req.body.userIds.length || !req.body.startDate || !req.body.endDate) {
        return res.status(400).send("Bad request");
    }

    let userIdArray = [],
        userIds = req.body.userIds,
        startDate = new Date(req.body.startDate),
        endDate = new Date(req.body.endDate);

    if (endDate.getTime() <= startDate.getTime()) {
        return res.status(400).send("Invalid startDate or endDate.");
    }

    userIds.map((userId) => {
        userIdArray = mongoose.Types.ObjectId(userId);
    })

    Transaction.find({
        'user': {
            "$in": userIdArray
        },
        'createdAt': {
            "$gte": startDate,
            "$lte": endDate
        }
    }).populate("user").exec((err, transactionData) => {
        if (err) {
            return res.status(500).send("Error occured");
        } else {
            if (transactionData.length) {
                let transactionArray = [];

                transactionData.map((transaction) => {
                    let transactionObj = {};

                    transactionObj.user = transaction.user.username;
                    transactionObj.transactionType = transaction.type;
                    transactionObj.amount = transaction.amount;
                    transactionObj.time = transaction.createdAt;

                    transactionArray.push(transactionObj);
                })
                const transactionCsv = Utility.jsonToCSV(transactionArray);
                return res.status(200).send(transactionCsv);
            } else {
                return res.status(404).send("No transactions found for given timeline");
            }
        };
    });
}

module.exports = {
    deposit,
    withdraw,
    balanceEnquiry,
    transactionDownload
}