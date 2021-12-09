const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = mongoose.model("User");

exports.userRegister = (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send(req.body.username);
    }
  });
  // User.register({username: req.body.username}, req.body.password, function(err, user){
  //   if (err) {
  //     res.send(err.message);
  //   } else {
  //     passport.authenticate("local")(req, res, function(){
  //       res.send("User Created");
  //     });
  //   }
  // });

};

exports.userLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.login(user, (err) => {
        if (err) throw err;
        res.send(req.user);
      });
    }
  })(req, res, next);
  // const user = new User({
  //   username: req.body.username,
  //   password: req.body.password,
  // });
  //
  // req.login(user, function(err){
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     passport.authenticate("local")(req, res, function(){
  //       res.send("Successfully Authenticated");
  //       console.log(req.user);
  //     });
  //   }
  // });
};

exports.getUser = (req, res) => {
  res.send(req.user);
};

exports.userLogout = (req, res) => {
  req.logout();
  res.send("Logged out")
};
