const express = require("express")
const controller = require("./../controllers/auth")
const registerSchema = require("./../validators/register")
const validate = require("./../middlewares/validate")

const router = express.Router()

router.route("/register").post(validate(registerSchema),controller.register)




module.exports = router