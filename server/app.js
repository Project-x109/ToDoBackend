require('dotenv').config();
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorhandling.js");
const passport = require("./middlewares/passport-config");
const { logMiddleware, store } = require("./middlewares/logMiddleware.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const user = require("./routes/userRoutes");
const cors = require("cors");
const csrf = require("csurf");
const todo = require("./routes/todoRoutes")
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://todo-app-mern1236.netlify.app/"],
        credentials: true,
    })
);
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
const csrfProtection = csrf({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    },
    name: "X-CSRF-TOKEN",
    value: (req) => req.csrfToken(),
    failAction: (req, res) => {
      res.status(403).send("Invalid CSRF token");
    },
  });
  app.use(csrfProtection);
  app.use((req, res, next) => {
    res.cookie(req.csrfToken());
    res.locals.csrfToken = req.csrfToken();
    next();
  });
app.use(passport.initialize());
app.use(passport.session());
app.use("/users", user);
app.use(todo);
app.use(logMiddleware);
app.use(errorHandler);
module.exports = app;