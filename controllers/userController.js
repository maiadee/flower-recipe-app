import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET log in page

router.route("/user/login").get(async function (req, res, next) {
  try {
    res.render("user/login.ejs");
  } catch (e) {}
});

// GET sign up page

router.route("/user/new").get(async function (req, res, next) {
  try {
    res.render("user/signup.ejs");
  } catch (e) {}
});

export default router;
