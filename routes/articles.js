const express = require("express");
const controller = require("./../controllers/article");
const createArticleSchema = require("./../validators/createArticle");
const validator = require("./../middlewares/validate");
const passport = require("passport");

const router = express.Router();

router
  .route("/")
  .post(
    validator(createArticleSchema),
    passport.authenticate("accessToken",{session:false}),
    controller.create,
  );

module.exports = router;
