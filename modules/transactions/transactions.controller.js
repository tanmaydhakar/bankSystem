const path = require("path"),
    mongoose = require('mongoose'),
    Transaction = mongoose.model("Transaction"),
    User = mongoose.model("User"),
    Constants = require(path.resolve('./modules/core/constants.controller')).constants,
    MailController = require(path.resolve('./modules/core/mail.controller')),
    Utility = require(path.resolve("./modules/core/utility.controller"));

//To Deposit Balance In Users Account
const deposit = function (req, res) {
    if (!req.body || !req.user || !req.body.amount || typeof req.body.amount != "number") {
        return res.status(400).send("Bad Request");
    }
    if (req.body.amount < 0) {
        return res.status(400).send("Deposit Amount Cant Be Less Than Zero");
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
            return res.status(500).send("Error Occured");
        }
        req.body.type = Constants.TRANSACTION_TYPE[0],
            req.body.userData = result;
        updateUserTransaction(req, res);
        MailController.sendTranscationMail(req, res);
        return res.status(200).send("Deposit Successfull");
    });
}

//To Withdraw Balance From Users Account
const withdraw = function (req, res) {
    if (!req.body || !req.user || !req.body.amount || typeof req.body.amount != "number") {
        return res.status(400).send("Bad Request");
    }
    if (req.body.amount < 0) {
        return res.status(400).send("Withdraw Amount Cant Be Less Than Zero");
    }
    const user = req.user._id,
        amount = req.body.amount;

    User.findOne({
        "_id": user
    }, function (err, userData) {
        if (err) {
            return res.status(500).send("Error Occured");
        }
        if (userData.balance < amount) {
            return res.status(400).send("You Dont Have Enough Balance To Withdraw");
        } else {
            User.findOneAndUpdate({
                "_id": user
            }, {
                "$inc": {
                    "balance": -Math.abs(amount)
                }
            }, {
                "new": true
            }, function (err, result) {
                if (err) {
                    return res.status(500).send("Error Occured");
                }
                req.body.type = Constants.TRANSACTION_TYPE[1],
                    req.body.userData = result;
                updateUserTransaction(req, res);
                MailController.sendTranscationMail(req, res);
                return res.status(200).send("Withdraw Successfull");
            })
        }
    });
}

//To Store Users Transaction Detail's In Database
const updateUserTransaction = function (req, res) {
    return new Promise((resolve, reject) => {

        const transactionsData = {
            user: req.user._id,
            type: req.body.type,
            amount: req.body.amount
        }

        Transaction.create(transactionsData, function (err, result) {
            if (err) {
                console.log(err, new Date());
                return reject(err);
            } else {
                return resolve();
            }
        })
    });
}

//For Balance Enquiry
const enquiry = function (req, res) {
    if (!req.user) {
        return res.status(400).send("Bad Request");
    }
    const user = req.user._id;
    User.findOne({
        "_id": user
    }, {
        "_id": 0,
        "balance": 1
    }, function (err, userBalance) {
        if (err) {
            console.log(err, new Date);
            return res.status(500).send("Error Occured");
        } else {
            return res.status(400).send(userBalance);
        }
    });
}

//To Download CSV File Of Any Users Transaction Within A Certain Timeline
const transactionDownload = function (req, res) {
    if (!req.body.userIds || !req.body.userIds.length || !req.body.startDate || !req.body.endDate) {
        return res.status(400).send("Bad Request");
    }

    var userIdArr = [],
        startDate = new Date(req.body.startDate),
        endDate = new Date(req.body.endDate);

    userIds.map((userId) => {
        userIdArr = mongoose.Types.ObjectId(userId);
    })

    Transaction.find({
        'user': {
            $in: userIdArr
        },
        'createdAt': {
            "$gte": startDate,
            "$lte": endDate
        }
    }).populate("user").exec((err, transactionData) => {
        if (err) {
            return res.status(500).send("Error Occured");
        } else {
            if (transactionData.length) {
                var transactionArray = [];

                transactionsData.map((transaction) => {
                    var transactionObj = {};

                    transactionObj.user = transaction.user.username,
                        transactionObj.transactionType = transaction.type,
                        transactionObj.amount = transaction.amount,
                        transactionObj.time = transaction.createdAt,

                        transactionArray.push(transactionObj);
                })
                const transactionCsv = Utility.jsonToCSV(transactionArray);
                return res.status(200).send(transactionCsv);
            } else {
                return res.status(400).send("No Transactions Found For Given Timeline");
            }
        };
    });
}

module.exports = {
    deposit,
    withdraw,
    enquiry,
    transactionDownload
}