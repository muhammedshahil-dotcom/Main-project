import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // renamed userId -> user
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true }, // added movie reference
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
