const express = require("express");
const upload = require("../config/multer");
const { getPostForm, createPost, getPosts, getPostById, editPost, updatePost, deletePost, editComment } = require("../controllers/postController");
const { ensureAuthenticated } = require("../middlewares/auth");
const postRoutes = express.Router();
postRoutes.get("/add", getPostForm);//postController la irunthu  getpostform logic link pannirukom
//post logic
postRoutes.post("/add", ensureAuthenticated, upload.array("images", 5), createPost);//postController la irunthu createpost logic link pannirukom
postRoutes.get("/", getPosts);
postRoutes.get("/:id", getPostById);
postRoutes.get("/:id/edit", editPost);
postRoutes.put("/:id", ensureAuthenticated, upload.array("images", 5), updatePost);//postController la irunthu updatepost logic link pannirukom);
postRoutes.delete("/:id", ensureAuthenticated, deletePost);








module.exports = postRoutes;

