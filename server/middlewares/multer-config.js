const multer = require("multer");

const authorizedExtensions = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]

// const extensions = MYME_TYPES.map(TYPE => TYPE.ext)

const removingExtensionFromName = (name, extension) => name.replace("." + extension, "")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = file.mimetype.replace("image/", "")

    // Check if provided file extension is part of the authorized image's extensions
    if (authorizedExtensions.find((ext) => ext === extension)) {
      const formattedName = removingExtensionFromName(name, extension)
      const fileName = formattedName + Date.now() + "." + extension;
      callback(null, fileName);
    } else {
      // If not send an error 500 but specify the following message and stop the execution
      callback(`Error 415: "${extension}" is a wrong file format. Authorized formats are: ` + JSON.stringify(authorizedExtensions));
      return
    }
  },
});

module.exports = multer({ storage }).single("image");
