import express from "express";
import Flower from "../models/flower.js";
import Recipe from "../models/recipe.js";

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

router.route("/flower-library/update/:id").get(async function (req, res, next) {
  try {
    const flowerId = req.params.id; // Get the flower ID from the route parameter
    const flower = await Flower.findById(flowerId); // Fetch the flower from the database

    res.render("flowers/update.ejs", { flower });
  } catch {
    next(e);
    console.log(e);
  }
});

// PUT update flower data

router.route("/flower-library/update/:id").put(async function (req, res, next) {
  try {
    if (!req.session.user) {
      return res
        .status(402)
        .send({ message: "You must be logged in to do that" });
    }
    const flowerId = req.params.id;
    const flower = await Flower.findById(flowerId, req.body, {
      new: true,
    }).populate("user");

    if (!flower.user._id.equals(req.session.user._id)) {
      return res
        .status(402)
        .send({ message: "This is not your flower to update!" });
    }

    await Flower.findByIdAndUpdate(flowerId);
    // !change to that particular flower use template literals
    res.redirect("/flower-library");
  } catch (e) {
    next(e);
    console.log(e);
  }
});

// * DELETE flower by id

router.route("/flower-library/:id").delete(async function (req, res, next) {
  try {
    // find data matching id
    const id = req.params.id;
    const deleteFlower = await Flower.findById(id);

    await Flower.findByIdAndDelete(id);

    res.redirect("/flower-library");
  } catch (e) {
    next(e);
  }
});

export default router;
