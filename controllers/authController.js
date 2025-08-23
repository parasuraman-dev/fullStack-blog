const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passPort = require("passport");
const asyncHandler = require("express-async-handler");

//render login
exports.loginPage = asyncHandler((req, res) => {
  console.log(req.user);
  res.render("login", {
    title: "Login",
    user: req.user,
    error: "",
  });
});
//render loginLogic
exports.loginLogic = asyncHandler(async (req, res, next) => {
  passPort.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login.ejs", {
        title: "Login",
        user: req.user,
        error: info.message,
      });
    }
    // for the session
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);//passport ooda link pannuthakaha
});
//render Register
exports.registerPage = asyncHandler((req, res) => {
  res.render("register", {
    title: "Register",
    user: req.user,
    error: "",
  });
});

// render RegisterLogic
exports.registerLogic = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        title: "Register",
        user: req.user,
        error: "user already exists",
      }); //register page(/register)
    }
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    //save the user to the database
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    res.render("register", {
      title: "Register",
      user: req.user,
      error: err.message,
    }); //register page
  }
});
//! Logout
exports.logout = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});