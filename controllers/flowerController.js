import express from "express";
import Flower from "../models/flower.js";
import Recipe from "../models/recipe.js";
import { startSession } from "mongoose";

const router = express.Router();

// GET homepage

router.route("/").get(async function (req, res, next) {
  try {
    res.render("home.ejs");
  } catch (e) {
    next(e);
  }
});

// GET filter flower search

router.route("/flower-library").get(async function (req, res, next) {
  try {
    // return sorted alphabetically
    console.log(`hello`);
    // get colour and season from the query parameters
    const { color, season } = req.query;

    // create an empty query object to build the MongoDB query
    let query = {};

    // if colour is selected, filter flowers by those colours
    if (color && Array.isArray(color)) {
      // mongo query
      query.color = {
        $in: color.map((c) => new RegExp(`^${c}$`, "i")), // Create regex for each colour - case insensitive
      };
    } else if (color) {
      // if only one colour is delected
      query.color = new RegExp(`^${color}$`, "i");
    }

    if (season && Array.isArray(season)) {
      query.season = { $in: season };
    } else if (season) {
      query.season = season;
    }
    console.log(query);

    // execute query on Flower model
    const flowers = await Flower.find(query);
    console.log(flowers);
    res.render("flowers/index.ejs", { allFlowers: flowers });
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

// GET errors page

router.route("/error").get(async function (req, res, next) {
  try {
    res.render("error.ejs");
  } catch (e) {
    next(e);
  }
});

// PUT update flower data

router.route("/flower-library/update/:id").put(async function (req, res, next) {
  try {
    const flowerId = req.params.id;
    const flower = await Flower.findById(flowerId);

    await Flower.findByIdAndUpdate(flowerId, req.body);

    res.redirect(`/flower-library/${flower._id}`);
  } catch (e) {
    next(e);
  }
});

// * DELETE flower by id

router.route("/flower-library/:id").delete(async function (req, res, next) {
  try {
    const id = req.params.id;
    const deleteFlower = await Flower.findById(id);

    await Flower.findByIdAndDelete(id);

    res.redirect("/flower-library");
  } catch (e) {
    next(e);
  }
});

//  * POST new flower

router.route("/flower-library/new").post(async function (req, res, next) {
  try {
    if (!req.session.user) {
      return res.redirect("/error");
    }

    await Flower.create(req.body);

    res.redirect("/flower-library");
  } catch (e) {
    next(e);
  }
});

export default router;
