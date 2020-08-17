const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    }
});

//send transaction mail to user
exports.sendTransactionMail = function (req, res) {
    return new Promise((resolve, reject) => {

        const amount = req.body.amount,
            balanceAvailable = req.body.userData.balance,
            transactionType = req.body.type;

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.user.email,
            subject: 'Transaction Alert!',
            html: `<p>Dear Valued Customer,<br><br>The below transaction has been done using your Node bank.<br><br></p><table style="width: 50%;"> <tbody> <tr> <td style="width: 50.0000%;"><strong>Description</strong></td><td style="width: 50.0000%;"><strong>Value</strong></td></tr><tr> <td style="width: 50.0000%;">Transaction Type</td><td style="width: 50.0000%;"><br>${transactionType}</td></tr><tr> <td style="width: 50.0000%;">Amount (INR)</td><td style="width: 50.0000%;"><br>${amount}</td></tr><tr> <td style="width: 50.0000%;">Balance Available (INR)</td><td style="width: 50.0000%;"><br>${balanceAvailable}</td></tr></tbody></table>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error, new Date());
                return reject(error);
            } else {
                return resolve();
            }
        });
    });
}