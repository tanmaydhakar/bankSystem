var path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Constants = require(path.resolve('./modules/core/constants.controller')).constants;

var Transaction = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: Constants.TRANSACTION_TYPE,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

mongoose.model('Transaction', Transaction);