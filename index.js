const path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    express = require('express'),
    expressRouter = express.Router(),
    passport = require('passport'),
    LocalStrategy = require("passport-local"),
    configFile = require(path.resolve('./config/config')),
    User = require(path.resolve('./modules/users/users.model')),
    Register = require(path.resolve('./register')),
    app = express();

//Setting up environment variables
const setupConfigs = function () {
    return new Promise((resolve, reject) => {
        for (let key in configFile) {
            process.env[key] = configFile[key];
        }
        return resolve();
    })
}

//Setting up mongodb database
const setupMongoDB = function () {
    return new Promise((resolve, reject) => {
        const mongooseOptions = {
            'useCreateIndex': true,
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
            "useFindAndModify": false
        }

        mongoose.connect(process.env.DB_URL, mongooseOptions, function (err, connectionResult) {
            if (err) {
                return reject(err);
            } else {
                console.log('MongoDB Connected Successfully');
                return resolve(connectionResult);
            }
        });
    });
}

//Registering all the routes
const registerModelsAndRoutes = function () {
    return new Promise((resolve, reject) => {
        Register.registerModelsAndRoutes(expressRouter).then(() => {
            return resolve();
        })
    });
}

//Setting up and initiating server
const serverSetup = function () {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use(passport.initialize());
    app.use(passport.session());

    setupConfigs().then(() => {
        app.use(require("express-session")({
            secret: process.env.SECRET,
            resave: false,
            saveUninitialized: false
        }));
        registerModelsAndRoutes().then(() => {
            setupMongoDB().then(() => {
                app.use('/', expressRouter);
                app.listen(process.env.PORT);
                console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
            });
        });
    });
}

serverSetup()