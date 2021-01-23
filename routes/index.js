const router = require("express").Router();
var passport = require("passport");
const user = require("../models/user");
var User = require("../models/user");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("home");
  } else {
    res.render("index");
  }
});

router.get("/login", ifNotLoggedIn, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  ifNotLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/",
    successFlash: "Login Successfull",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {}
);

router.get("/register", ifNotLoggedIn, (req, res) => {
  res.render("register");
});

router.post("/register", ifNotLoggedIn, (req, res) => {
  var user = {
    name: req.body.name,
    email: req.body.email,
  };
  User.register(user, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome, " + user.name);
        res.redirect("/");
      });
    }
  });
});

router.get("/logout", ifLoggedIn, (req, res) => {
  req.logOut();
  req.flash("success", "Logout successfull.");
  res.redirect("/");
});

router.get("/updatePassword", ifLoggedIn, (req, res) => {
  res.render("updatePassword");
});

router.post("/updatePassword", ifLoggedIn, (req, res) => {
  User.findOne(req.user._id, (err, user) => {
    user.changePassword(req.body.oldPassword, req.body.newPassword, (err) => {
      if (err) {
        var error = err.message;
        if (err.message.includes("Password or username is incorrect")) {
          error = "Old Password is incorrect";
        } else {
          error = err.message;
        }
        req.flash("error", error);
        res.redirect("/updatePassword");
      }
      req.flash("success", "Password Updated successfully.");
      res.redirect("/");
    });
  });
});

function ifLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Please login first!");
    res.redirect("/login");
  }
}

function ifNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You're already logged in!");
    res.redirect("/");
  }
}

module.exports = router;
