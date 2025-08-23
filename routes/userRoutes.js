const userRoutes = require("express").Router();
const { getProfile, getEditProfile, updateProfile, deleteAccount } = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");
//!get user Profile
userRoutes.get("/profile", ensureAuthenticated, getProfile);
userRoutes.get("/edit", ensureAuthenticated, getEditProfile);
userRoutes.post("/edit", ensureAuthenticated, upload.single("profilePicture"), updateProfile);
userRoutes.post("/delete", ensureAuthenticated, deleteAccount);
module.exports = userRoutes;