require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const MongoStore = require('connect-mongo');
const LocalStrategy = require("passport-local").Strategy;

global.User = require("./api/models/userModel");
global.Log = require("./api/models/logModel");
const logRoutes = require("./api/routes/logRoutes");
const userRoutes = require("./api/routes/userRoutes");

mongoose.Promise = global.Promise;

const port = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGODB_URL,
  //   mongoOptions: { useUnifiedTopology: true } // See below for details
  // })
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    const userInformation = {
      username: user.username,
    };
    cb(err, userInformation);
  });
});

logRoutes(app);
userRoutes(app);
app.listen(port);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/logs", (req, res, next) => {
  if (req.isAuthenticated()){
    res.send("logs");
  } else {
    next();
  }
});

app.use((req, res) => {
  res.status(404).send({ url: `${ req.originalUrl } Not Found`});
});

console.log(`Server started on http://localhost:${ port }`);
