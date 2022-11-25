const multer = require("multer");

const MYME_TYPES = {
  "image/apng": ".apng",
  "image/avif": ".avif",
  "image/gif": ".gif",
  /* ↓↓↓ image/jpeg extensions ↓↓↓ */
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/jfif": "jfif",
  "image/pjpeg": "pjpeg",
  "image/pjp": "pjp",
  /* ↑↑↑ image/jpeg extensions ↑↑↑ */
  "image/png": "png",
  "image/svg+xml": ".svg",
  "image/webp": "webp",
};

const removingExtensionFromName = (name, extension) => name.replace("." + extension, "")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");

    for (const MYME_TYPE in MYME_TYPES) {
      if (Object.hasOwnProperty.call(MYME_TYPES, MYME_TYPE)) {
        const extension = MYME_TYPES[MYME_TYPE];

        // Check if provided file extension is part of the authorized image's extensions
        if (name.includes("." + extension)) {
          const formattedName = removingExtensionFromName(name, extension)
          const fileName = formattedName + Date.now() + "." + extension;
          callback(null, fileName);
        } else {
          // If not send an error 500 but specify the following message and stop the execution
          callback('Error 404: Images Only!');
        }
      }
    }
  },
});

module.exports = multer({ storage }).single("image");
