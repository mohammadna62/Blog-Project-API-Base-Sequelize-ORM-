const express = require("express");
const controller = require("./../controllers/article");
const validate = require("./../middlewares/validate");
const createArticleSchema = require("../validators/createArticle");
const passport = require("passport");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../public/images/covers"));
  },

  filename: (req, file, cb) => {
    const fileName =
      `${file.originalname}-${Date.now()}` + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const validFileTypes = /jpeg|jpg|png/;
  const mimeType = validFileTypes.test(file.mimetype);
  const extName = validFileTypes.test(path.extname(file.originalname));

  if (mimeType && extName) {
    return cb(null, true);
  }

  return cb(new Error("File type not supported !"));
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

const router = express.Router();

router.route("/").post(
  passport.authenticate("accessToken", { session: false }),
  uploader.single("cover"),
  validate(createArticleSchema),

  controller.create
).get(controller.findAll);
router.route("/:slug").get(controller.findBySlug)

router.route("/:id").delete(passport.authenticate('accessToken',{session:false}),controller.deleteArticle)

module.exports = router;
