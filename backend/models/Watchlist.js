import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    createdAt: { type: Date, default: Date.now }
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
