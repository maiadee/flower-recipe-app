import express from "express";
import Flower from "../models/flower.js";

const router = express.Router();

// GET homepage

router.route("/").get(async function (req, res, next) {
  try {
    res.render("home.ejs");
  } catch (e) {
    next(e);
  }
});

// GET library of flowers
router.route("/flower-library").get(async function (req, res, next) {
  try {
    const allFlowers = await Flower.find().exec();
    res.render("flowers/index.ejs", {
      allFlowers: allFlowers,
    });
  } catch (e) {
    next(e);
  }
});

// GET flower profile page

router.route("/flower-library/:id").get(async function (req, res, next) {
  try {
    // find data matching id
    const flowerId = req.params.id;
    const flower = await Flower.findById(flowerId);
    res.render("flowers/show.ejs", {
      flower: flower,
    });
  } catch (e) {
    next(e);
  }
});

// GET new flower page

router.route("/new").get(async function (req, res, next) {
  try {
    res.render("flowers/new.ejs");
  } catch (e) {
    next(e);
  }
});

// GET update flower page

router.route("/update").get(async function (req, res, next) {
  try {
    res.render("flowers/update.ejs");
  } catch {
    next(e);
  }
});

export default router;
