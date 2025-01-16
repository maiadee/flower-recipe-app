import express from "express";
import mongoose from "mongoose";
import commentController from "./controllers/commentController.js";
import flowerController from "./controllers/flowerController.js";
import userController from "./controllers/userController.js";

const app = express();

// so we can post JSON to express
app.use(express.json());

// use controllers
app.use("/", userController);
app.use("/", flowerController);
app.use("/", commentController);

// listening for requests on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
