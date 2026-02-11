import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    releaseYear: {
      type: Number,
    },
    posterUrl: {
      type: String,
      default: null,
    },
    bannerUrl: {
      type: String,
      default: null,
    },
    gallery: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

movieSchema.pre("save", function setReleaseYear(next) {
  if (!this.releaseYear && this.releaseDate) {
    this.releaseYear = new Date(this.releaseDate).getFullYear();
  }
  next();
});

export default mongoose.model("Movie", movieSchema);
