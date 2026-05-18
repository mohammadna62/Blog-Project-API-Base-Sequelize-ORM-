const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const passport = require("passport");

const localStrategy = require("./strategies/localStrategy");
const captchaController = require("./controllers/captch");
const authRoutes = require("./routes/auth");
const articlesRoutes = require("./routes/articles");

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

// app.use(localStrategy);

// app.get("/captcha", captchaController.get);
app.use("/auth", authRoutes);
app.use("/articles", articlesRoutes);

module.exports = app;
