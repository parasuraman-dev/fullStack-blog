const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./config/passPort");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const port = process.env.port || 3000;
require("dotenv").config(); //config the environment files
// db info pw:JqZLhug33k9tfPBy
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const errorHandler = require("./middlewares/errrorHandler");
const CommentRoutes = require("./routes/commentRoutes");
const userRoutes = require("./routes/userRoutes");
//todo middleware for passing the form
app.use(express.urlencoded({ extended: true })); //input form data
//session  middleware
app.use(
  session({
    secret: "secret agent",
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);
// methodOverride middleware
app.use(methodOverride("_method"));
//passport configuration
passportConfig(passport);
app.use(passport.initialize()); //intialize
app.use(passport.session()); //used to store the user in th session

//ejs
app.set("view engine", "ejs");
// routes
//home routes
app.get("/", (req, res) => {
  res.render("home", {
    title: "Home Page",
    user: req.user,
    err: "",
  });
});

app.use("/auth", authRoutes); //authRoutes ku link pannirukom
app.use("/posts", postRoutes); //postRoutes ku link panirukom
app.use("/", CommentRoutes); //CommentRoutes ku link panirukom
app.use("/user", userRoutes); //userRoutes ku link panirukom

//error handler
app.use(errorHandler);
// start the server & mongodb connection together
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
