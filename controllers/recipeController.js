import express from "express";
import Recipe from "../models/recipe.js";
import Flower from "../models/flower.js";

const router = express.Router();

// GET recipe library

router.route("/recipe-library").get(async function (req, res, next) {
  try {
    const allRecipes = await Recipe.find().exec();
    res.render("flowers/recipeIndex.ejs", {
      allRecipes: allRecipes,
    });
  } catch (e) {
    next(e);
    console.log(e);
  }
});

// GET recipe page by id

router.route("/recipe-library/:id").get(async function (req, res, next) {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId).populate("flower");
    console.log(recipe);
    res.render("flowers/recipe.ejs", {
      recipe: recipe,
    });
  } catch (e) {
    next(e);
  }
});

// make a post flower end point that pushes my flower into that recipes flower array
// * will need to get the selected flower and push it
// * then redirect to that recipe page

// POST flower to recipe

router
  .route("/flower-library/:id/add-flower")
  .post(async function (req, res, next) {
    try {
      const flowerId = req.params.id;
      const selectedRecipe = req.body.recipe;

      const slicedRecipe =
        selectedRecipe.slice(0, 6) + " " + selectedRecipe.slice(6);

      // finding one recipe in my array
      const recipe = await Recipe.findOne({ name: slicedRecipe });

      const flowerFromDb = await Flower.findById(flowerId);

      recipe.flower.push(flowerFromDb);
      await recipe.save();
      console.log(recipe);
      res.redirect(`/recipe-library/${recipe._id}`);
    } catch (e) {
      next(e);
    }
  });

// DELETE flower from recipe

router.route("/recipe/:id").delete(async function (req, res, next) {
  try {
    // find flower id
    const flowerId = req.body.flowerId;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);

    //   find flower and turn objectId into string
    const flowerIndex = recipe.flower.findIndex(
      (flower) => flower.toString() === flowerId
    );

    //   *if there are multiples of the same flower
    //   flower only removed if it exists in array
    if (flowerIndex !== -1) {
      recipe.flower.splice(flowerIndex, 1); // Remove only one
    }

    //   save updated recipe
    await recipe.save();

    res.redirect(`/recipe-library/${recipeId}`);
  } catch (e) {
    next(e);
  }
});

export default router;
