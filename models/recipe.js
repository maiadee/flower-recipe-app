import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  flower: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Flower", required: true },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Recipe", recipeSchema);
