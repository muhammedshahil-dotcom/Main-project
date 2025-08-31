import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    releaseDate: { type: Date },
    posterUrl: { type: String },   
    trailerUrl: { type: String },
    averageRating: { type: Number, default: 0 },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
