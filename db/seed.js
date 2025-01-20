import mongoose from "mongoose";
import Flower from "../models/flower.js";
import User from "../models/user.js";
import flowers from "../data.js";
import Recipe from "../models/recipe.js";

async function seed() {
  console.log(`hello seed`);

  // connect to mongoose
  const url = "mongodb://127.0.0.1:27017/";
  const dbname = "flower-recipe-db";
  await mongoose.connect(`${url}${dbname}`);

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

  // seed a recipe
  const recipe = await Recipe.create(
    { name: `Recipe 1`, user: user },
    { name: `Recipe 2`, user: user },
    { name: `Recipe 3`, user: user },
    { name: `Recipe 4`, user: user }
  );

  // add data to database
  const newFlowers = await Flower.create(flowers);
  console.log(newFlowers);

  // ! does this work?
  // seed comments
  const comment = {
    content: `test comment`,
    user: user,
  };

  // push to the comment arrays
  newFlowers[0].comments.push(comment);

  // save it back to the database
  await newFlowers[0].save();

  // disconnet
  await mongoose.disconnect();
  console.log(`disconnected from mongoose`);
}

seed();
