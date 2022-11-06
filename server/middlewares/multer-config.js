const multer = require("multer");

const MYME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MYME_TYPES[file.mimetype];
    const fileName = name + Date.now() + "." + extension;
    callback(null, fileName);
  },
});

module.exports = multer({ storage }).single("image");
