const express = require("express")
const controller = require("./../controllers/auth")
const registerSchema = require("./../validators/register")
const loginSchema = require("./../validators/login")
const validate = require("./../middlewares/validate")
const passport = require("passport");

const router = express.Router()

router.route("/register").post(validate(registerSchema),controller.register)
router
  .route("/login")
  .post(
    validate(loginSchema),
    passport.authenticate("local", { session: false }),
    controller.login
  );




module.exports = router