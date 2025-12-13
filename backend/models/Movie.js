import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String], // Supports multiple genres like ["Sci-Fi", "Adventure"]
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },

    // 🔥 Main poster (vertical image)
    posterUrl: {
      type: String,
      default: null,
    },

    // 🔥 Banner (Netflix-style widescreen header)
    bannerUrl: {
      type: String,
      default: null,
    },

    // 🎞 Extra images if needed
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
    bannerUrl: {
      type: String,
      required: false
    }

  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
