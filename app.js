const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");

// ENV VARIABLES
const PORT = process.env.PORT || 3000;
const DB = "auth-demo",
  DB_USER = process.env.DB_USER,
  DB_PASS = process.env.DB_PASS,
  DB_HOST = process.env.DB_HOST,
  DB_URL =
    "mongodb+srv://" +
    DB_USER +
    ":" +
    DB_PASS +
    "@" +
    DB_HOST +
    "/" +
    DB +
    "?retryWrites=true&w=majority";

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(
  require("express-session")({
    secret: "My secret key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use below line if using default strategy and fields
// passport.use(new LocalStrategy(User.authenticate()));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));

app.listen(PORT, (req, res) => {
  console.log("Server started...");
});
