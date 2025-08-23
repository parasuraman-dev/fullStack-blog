
const mongoose = require("mongoose");

//schema
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // to add createdAt and updatedAt fields
  }
);
// model
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;