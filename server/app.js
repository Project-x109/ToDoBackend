require('dotenv').config();
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorhandling.js");
const passport = require("./middlewares/passport-config");
const { logMiddleware, store } = require("./middlewares/logMiddleware.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const user = require("./routes/userRoutes");
const todo = require("./routes/todoRoutes")
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);
app.use(logMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/users", user);
app.use(todo);
app.use(errorHandler);
module.exports = app;