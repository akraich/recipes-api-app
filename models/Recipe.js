import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RecipeSchema = Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [Schema.Types.ObjectId],
    ref: "Recipe"
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String
  }
});

export default mongoose.model("Recipe", RecipeSchema);
