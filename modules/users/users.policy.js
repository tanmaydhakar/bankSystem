const path = require("path"),
    Constants = require(path.resolve('./modules/core/constants.controller')).constants;

const isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send("Please Login To Access This Feature");
}

const isManager = function (req, res, next) {
    if (!req.user || !req.user.roles) {
        return res.status(400).send("Bad Request");
    }
    if (req.user.roles.includes(Constants.ROLES[0])) {
        return next();
    } else {
        return res.status(403).send("You Dont Have Permission To Access This URL");
    }
}

module.exports = {
    isLoggedIn,
    isManager
}