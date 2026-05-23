const express = require("express")
const controller = require("./../controllers/article")
const createArticleSchema = require("./../validators/createArticle")
const validator = require("./../middlewares/validate")

const router = express.Router()

router.route("/").post(validator(createArticleSchema),controller.create)




module.exports = router