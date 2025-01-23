import express from "express";
import User from "../models/user.js";
import Recipe from "../models/recipe.js";

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
      return res.redirect("/signup-error");
    }

    if (password !== passwordConfirmation) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    // create document in database
    const user = await User.create(req.body);

    await Recipe.create({ name: `Recipe 1`, user: user });
    await Recipe.create({ name: `Recipe 2`, user: user });
    await Recipe.create({ name: `Recipe 3`, user: user });
    await Recipe.create({ name: `Recipe 4`, user: user });

    res.redirect("/user/login");
  } catch (e) {
    next(e);
    console.log(e);
  }
});

// POST login user

router.route("/user/login").post(async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check if user exists
    if (!user) {
      return res.redirect("/login-fail");
    }

    if (!user.isPasswordValid(req.body.password)) {
      return res.redirect("/login-fail");
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
    res.redirect("/user/login");
  } catch (e) {
    next(e);
  }
});

// GET errors page

router.route("/error").get(async function (req, res, next) {
  try {
    res.render("errors/loginerror.ejs");
  } catch (e) {
    next(e);
  }
});

// GET sign up error page

router.route("/signup-error").get(async function (req, res, next) {
  try {
    res.render("errors/signupError.ejs");
  } catch (e) {
    next(e);
  }
});

// GET log in fail page

router.route("/login-fail").get(async function (req, res, next) {
  try {
    res.render("errors/loginFail.ejs");
  } catch (e) {
    next(e);
  }
});

export default router;
