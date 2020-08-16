const path = require('path'),
    passport = require('passport'),
    userController = require(path.resolve('./modules/users/users.controller'));

module.exports = function (app) {

    //For User Login
    app.post("/login", passport.authenticate("local"), userController.login);

    //For User Registration
    app.post("/register", userController.register);

    //For User Logout
    app.get("/logout", userController.logout);

    //Homepage
    app.get("/", userController.homepage);
};