
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");//cloudinary.js la irunthu link pannirukom

//* Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fullstack-blog-project",
    allowedFormats: ["jpg", "png", "gif"],
  },
});

const upload = multer({ storage });
module.exports = upload;