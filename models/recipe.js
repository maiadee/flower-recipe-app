import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  flower: [flowerSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Recipe", recipeSchema);
