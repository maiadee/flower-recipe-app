import mongoose from "mongoose";

const recipeNoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "You can't post an empty note!"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  flower: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Flower", required: true },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notes: [recipeNoteSchema],
});

export default mongoose.model("Recipe", recipeSchema);
