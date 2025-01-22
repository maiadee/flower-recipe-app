import express from "express";
import Flower from "../models/flower.js";
import Recipe from "../models/recipe.js";

const router = express.Router();

router.route("/flower-library/:id/notes").post(async function (req, res, next) {
  try {
    // give the note a user
    req.body.user = req.session.user;

    const flower = await Flower.findById(req.params.id);
    console.log(flower);
    //   push note to the body
    flower.notes.push(req.body);
    //   save on the database
    flower.save();

    res.redirect(`/flower-library/${req.params.id}`);
  } catch (e) {
    next(e);
    console.log(e);
  }
});

router
  .route("/flower-library/:id/notes/:noteId")
  .delete(async function (req, res, next) {
    try {
      // find flower by id
      const flower = await Flower.findById(req.params.id);
      // find the comment id that i want to delete
      const noteIndex = flower.notes.findIndex(
        (note) => note._id.toString() === req.params.noteId
      );

      if (noteIndex === -1) {
        return res.send({ message: "Note not found" });
      }
      // check comment was posted by current user
      if (
        flower.notes[noteIndex].user.toString() !==
        req.session.user._id.toString()
      ) {
        return res.send({
          message: "You cannot delete a note that you did not post",
        });
      }
      // delete comment
      flower.notes.splice(noteIndex, 1);
      await flower.save();

      res.redirect(`/flower-library/${req.params.id}`);
    } catch (e) {
      next(e);
      console.log(e);
    }
  });

router.route("/recipe-library/:id/notes").post(async function (req, res, next) {
  try {
    console.log(`hello`);
    console.log(req.session.user, req.body);

    // Ensure the note has the required fields
    const note = {
      content: req.body.content, // Get content
      user: req.session.user, // only the user ID is passed
    };

    const recipe = await Recipe.findById(req.params.id);

    //   push note to the body
    recipe.notes.push(note);

    //   save on the database
    await recipe.save();

    res.redirect(`/recipe-library/${req.params.id}`);
  } catch (e) {
    next(e);
  }
});

router
  .route("/recipe-library/:id/notes/:noteId")
  .delete(async function (req, res, next) {
    try {
      // find flower by id
      const recipe = await Recipe.findById(req.params.id);
      // find the comment id that i want to delete
      const noteIndex = recipe.notes.findIndex(
        (note) => note._id.toString() === req.params.noteId
      );

      // delete comment
      recipe.notes.splice(noteIndex, 1);
      await recipe.save();

      res.redirect(`/recipe-library/${req.params.id}`);
    } catch (e) {
      next(e);
      console.log(e);
    }
  });

export default router;
