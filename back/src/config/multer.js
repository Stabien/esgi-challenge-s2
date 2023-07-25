const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("File is not a pdf"), false);
  }
};

const upload = multer({ 
  storage: storage,
  filter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 10
  }
})

module.exports = upload