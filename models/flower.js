import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "You can't post an empty note!"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const flowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientific_name: { type: String, required: false },
  color: { type: String, required: true },
  season: {
    type: String,
    enum: [
      "Spring",
      "spring",
      "Summer",
      "summer",
      "Year-round",
      "year-round",
      "Autumn",
      "autumn",
      "Winter",
      "winter",
    ],
  },
  image_url: { type: String, required: true },
  notes: [noteSchema],
});

export default mongoose.model("Flower", flowerSchema);
