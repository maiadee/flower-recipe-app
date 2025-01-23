import mongoose from "mongoose";
import Flower from "../models/flower.js";
import User from "../models/user.js";
import flowers from "../data.js";
import Recipe from "../models/recipe.js";

import dotenv from "dotenv";
dotenv.config(); // initalises .env

async function seed() {
  console.log(`hello seed`);

  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`connected to mongoose`);

  // clear database
  await mongoose.connection.db.dropDatabase();

  console.log(`database cleared`);

  // seed a user
  const user = await User.create({
    username: "Maia",
    email: "maia@maia.com",
    password: "Maia1234!",
  });

  await Recipe.create({ name: `Recipe 1`, user: user });
  await Recipe.create({ name: `Recipe 2`, user: user });
  await Recipe.create({ name: `Recipe 3`, user: user });
  await Recipe.create({ name: `Recipe 4`, user: user });

  // add data to database

  const newFlowers = await Flower.create(flowers);
  console.log(newFlowers);

  // save it back to the database
  await newFlowers[0].save();

  // disconnet
  await mongoose.disconnect();
  console.log(`disconnected from mongoose`);
}

seed();
