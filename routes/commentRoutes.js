const express = require("express");
const CommentRoutes = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");
const { addComment,  getComments, editComment, deleteComment} = require("../controllers/commentController");
CommentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);
CommentRoutes.get("/comments/:id/edit", ensureAuthenticated, getComments);
CommentRoutes.put("/comments/:id", ensureAuthenticated, editComment);
CommentRoutes.delete("/comments/:id", ensureAuthenticated,deleteComment);
module.exports = CommentRoutes;