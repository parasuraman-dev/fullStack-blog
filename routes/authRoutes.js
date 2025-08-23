const express = require("express");

const User = require("../models/User");
const { loginPage, loginLogic, registerPage, registerLogic, logout } = require("../controllers/authController");
const authRoutes = express.Router();

// routs the login
authRoutes.get("/login",loginPage );
//login logic
authRoutes.post("/login",loginLogic );

// routs the register
authRoutes.get("/register",registerPage );
//registration logic
authRoutes.post("/register", registerLogic);
//logout
authRoutes.get("/logout", logout);
module.exports = authRoutes;
