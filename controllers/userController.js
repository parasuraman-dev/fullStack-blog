const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");
// !get user Profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      user,
      error: "user not found",
    });
  }
  const posts = await Post.find({ author: req.user._id }).sort({
    createdAt: -1,
  });
  res.render("profile.ejs", {
    title: "Profile",
    user,
    posts,
    postCount: posts.length,
    error: "",
  });
});
// ! edit user profile
exports.editProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      user,
      error: "user not found",
    });
  }
  res.render("editProfile.ejs", {
    title: "Edit Profile",
    user,
    error: "",
  });
});
// !get edit profile form
exports.getEditProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.render("login.ejs", {
      title: "Login",
      user,
      success: "",
      error: "user not found",
    });
  }
  res.render("editProfile.ejs", {
    title: "Edit Profile",
    user,
    success: "",
    error: "",
  });
});
// !update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
    const { username, email, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.render("login.ejs", {
        title: "Login",
        user,
        error: "user not found",
      });
    }
    user.username = username||user.username;
    user.email = email||user.email;
    user.bio = bio || user.bio;
    if (req.file) {
        if (user.profilePicture && user.profilePicture.public_id) {
            await cloudinary.uploader.destroy(user.profilePicture.public_id);
        }
        const file=new File({
            url: req.file.path,
            public_id: req.file.filename,
            uploaded_by: req.user._id,
        });
        await file.save();
        user.profilePicture = {
            url: file.url,
            public_id: file.public_id,
            };
      };
    await user.save();
    res.redirect("/user/profile");
});
// !delete user account
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.render("login", {
      title: "Login",
      user: req.user,
      error: "User not found",
    });
  }
// Delete user's profile picture from Cloudinary
  if (user.profilePicture && user.profilePicture.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }
  // Delete all posts created by the user and their associated images and comments
  const posts = await Post.find({ author: req.user._id });
  for (const post of posts) {
    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
  }
  //delete the all comments made by the user
  await Comment.deleteMany({ author: req.user._id });

  //delete all files uploaded by the user
  const files = await File.find({ uploaded_by: req.user._id });
  for (const file of files) {
    await cloudinary.uploader.destroy(file.public_id);
  }
  //delete user
  await User.findByIdAndDelete(req.user._id);
  res.redirect("/auth/register");
});
    
    