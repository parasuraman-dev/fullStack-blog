const Post = require("../models/Post");
const File = require("../models/File");
const cloudinary = require("../config/cloudinary");
const asyncHandler = require("express-async-handler");

//render the post form
exports.getPostForm = asyncHandler((req, res) => {
  res.render("newPost", {
    title: "CreatePost",
    user: req.user,
    error: "",
    success: "",
  });
});
//!Creating a new post
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  //     console.log(req.files);
  //     const newPost = await Post.create({
  //         title,
  //         content,
  //         author: req.user._id,

  //     });
  //     console.log(newPost);
  //     res.redirect("/posts");
  //!validation
  if (!req.files || req.files.length === 0) {
    return res.render("newPost.ejs", {
      title: "Create Post",
      user: req.user,
      error: "Please select atlease one image file",
      success: "",
    });
  }
  const images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      // !another method of creating the file  "File"=model name
      //     const newFile=await File.create({
      //     url: file.path,
      //     public_id: file.filename,
      //     uploaded_by: req.user._id,
      //   });
      return { url: newFile.url, public_id: newFile.public_id };
    })
  );
  //post ooda creation
  const newPost = await Post.create({
    title,
    content,
    author: req.user._id,
    images,
  });
  res.redirect("/posts");
  //     res.render("newPost", {
  //     title: "Create Post",
  //     user: req.user,
  //     success: "Post created successfully",
  //      error: "",
  //    });
});
//!get all posts
exports.getPosts = asyncHandler(async (req, res) => {
  const AllPosts = await Post.find().populate("author", "username");
  res.render("posts.ejs", {
    title: "Posts",
    posts: AllPosts,
    user: req.user,
    success: "",
    error: "",
  });
});
// ! get post by id
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
        select: "username",
      },
    });

  console.log(post);
  res.render("postDetails", {
    title: post.title,
    post,
    user: req.user,
    success: "",
    error: "",
  });
});
// !edit post
exports.editPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username"
  );
  if (!post) {
    return res.render("postDetails", {
      title: "Post Not Found",
      user: req.user,
      error: "post not found",
      success: "",
    });
  }
  res.render("editPost", {
    title: "Edit Post",
    post,
    user: req.user,
    success: "",
    error: "",
  });
});
// !update post
exports.updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post Not Found",
      post,
      user: req.user,
      error: "post not found",
      success: "",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post Not Found",
      post,
      user: req.user,
      error: "You are not authorized to update this post",
      success: "",
    });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  if (req.files) {
    await Promise.all(
      post.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id); //delete image from cloudinary
      })
    );
  }
  post.images = await Promise.all(
    req.files.map(async (file) => {
      const newFile = new File({
        url: file.path,
        public_id: file.filename,
        uploaded_by: req.user._id,
      });
      await newFile.save();
      return { url: newFile.url, public_id: newFile.public_id };
    })
  );

  await post.save();

  res.redirect(`/posts/${post._id}`);
});
// !delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.render("postDetails", {
      title: "Post Not Found",
      post,
      user: req.user,
      error: "post not found",
      success: "",
    });
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.render("postDetails", {
      title: "Post Not Found",
      post,
      user: req.user,
      error: "You are not authorized to delete this post",
      success: "",
    });
  }
  await Promise.all(
    post.images.map(async (image) => {
      await cloudinary.uploader.destroy(image.public_id); //delete image from cloudinary
    })
  );
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/posts");
});

