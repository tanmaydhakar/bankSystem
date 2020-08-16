const path = require("path"),
    mongoose = require('mongoose'),
    User = mongoose.model("User");

const logout = function (req, res) {
    req.logout();
    return res.redirect("/");
}

const register = function (req, res) {
    if (!req.body || !req.body.username || !req.body.email || !req.body.password || !req.body.fullname) {
        return res.status(400).send("Bad Request");
    }

    var userData = {
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
    }

    User.register(new User(userData), req.body.password, function (err, user) {
        if (err) {
            console.log(err, new Date());
            return res.status(500).send(err.message);
        }
        return login(req, res);
    });
}

const login = function (req, res) {
    return res.redirect("/");
}

const homepage = function (req, res) {
    return res.sendFile(path.resolve('./homepage.html'))
}

module.exports = {
    logout,
    register,
    login,
    homepage
}