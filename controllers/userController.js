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

// POST new user

router.route("/user/new").post(async function (req, res, next) {
  try {
    const { password, passwordConfirmation } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    // create document in database
    await User.create(req.body);

    res.redirect("/user/login");
  } catch (e) {
    next(e);
  }
});

// POST login user

router.route("/user/login").post(async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user.isPasswordValid(req.body.password)) {
      // ! edit this so an alart shows up saying login failed
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.session.user = user;
    res.redirect("/");
  } catch (e) {
    next(e);
  }
});

// GET logout session

router.route("/user/logout").get(async function (req, res, next) {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (e) {
    next(e);
  }
});

export default router;
