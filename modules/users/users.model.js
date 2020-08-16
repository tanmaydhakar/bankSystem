const path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    Constants = require(path.resolve('./modules/core/constants.controller')).constants;

const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const User = new Schema({
    username: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
    },
    fullname: {
        type: String,
        required: true,
    },
    roles: {
        type: [{
            type: String,
            enum: Constants.ROLES
        }],
        default: ['User'],
        required: 'Please provide at least one role'
    },
    balance: {
        type: Number,
        default: 0
    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);