const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  // find the post for comment
  const post = await Post.findById(postId);
  if (!post) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "post not found",
      success: "",
    });
  }
  // check if not content
  if (!content) {
    return res.render("postDetails", {
      title: "Post",
      post,
      user: req.user,
      error: "Please enter a comment",
      success: "",
    });
  }
  // add comment
  const newComment = new Comment({
    content,
    post: postId,
    author: req.user._id,
  });
  // save comment
  await newComment.save();
  // add/push comment to post
  post.comments.push(newComment._id);
  await post.save();
  console.log(post);
  // redirect to post details page
  res.redirect(`/posts/${postId}`);
});
// !get comments form
exports.getComments = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Comment Not Found",
      user: req.user,
      error: "comment not found",
      success: "",
    });
  }
  res.render("editComment.ejs", {
    title: "Comments",
    comment,
    user: req.user,
    success: "",
    error: "",
  });
});

// !comments edit
exports.editComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Comment Not Found",
      user: req.user,
      error: "comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Comment Not Found",
      user: req.user,
      error: "You are not authorized to update this comment",
      success: "",
    });
  }
  comment.content = content || comment.content;
  await comment.save();
  res.redirect(`/posts/${comment.post}`);
  // res.render("editComment", {
  //   title: "Edit Comment",
  //   comment,
  //   user: req.user,
  //   success: "",
  //   error: "",
  // });
});
// !comments delete
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.render("postDetails", {
      title: "Comment Not Found",
      user: req.user,
      error: "comment not found",
      success: "",
    });
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Comment Not Found",
      user: req.user,
      error: "You are not authorized to delete this comment",
      success: "",
    });
  }
  await Comment.findByIdAndDelete(req.params.id);
  res.redirect(`/posts/${comment.post}`);
});
