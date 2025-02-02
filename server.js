import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";

import noteController from "./controllers/noteController.js";
import flowerController from "./controllers/flowerController.js";
import userController from "./controllers/userController.js";
import recipeController from "./controllers/recipeController.js";

import flowers from "./data.js";

import dotenv from "dotenv";
dotenv.config(); // initalises .env

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// * Add sessions to express
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/flower-recipe-db",
      collectionName: "sessions", // Optional: specify the collection name
    }),
    cookie: {
      secure: false, // is this using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // expires tomorrow
    },
  })
);
// * make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// so we can post JSON to express
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// serve static files from the directory
app.use(express.static(path.join(__dirname, "public")));

// use controllers
app.use("/", userController);
app.use("/", flowerController);
app.use("/", noteController);
app.use("/", recipeController);

// listening for requests on port 3000
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// * Connect to database using mongoose.
const url = "mongodb://127.0.0.1:27017/";
const dbname = "flower-recipe-db";
mongoose.connect(`${url}${dbname}`);
