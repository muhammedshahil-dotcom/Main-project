import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { getReviewsByMovie, addReview } from "../services/reviewService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";


function MovieDetails() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);


  const [editingReview, setEditingReview] = useState(null);

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review?")) return;

    try {
      await deleteReview(reviewId, token);
      setReviews(await getReviewsByMovie(id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (reviewId) => {
  try {
    await updateReview(reviewId, { rating, comment }, token);
    setEditingReview(null);
    setReviews(await getReviewsByMovie(id));
  } catch (err) {
    console.log(err);
  }
};



  // ⭐ NEW STATE
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        const movieData = await getMovieById(id);
        const reviewData = await getReviewsByMovie(id);

        setMovie(movieData);
        setReviews(reviewData);
      } catch (err) {
        console.error("❌ Failed to fetch movie or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to post a review.");

    try {
      await addReview(id, { rating, comment }, token);
      const updatedReviews = await getReviewsByMovie(id);
      setReviews(updatedReviews);

      // reset after submit
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("❌ Failed to add review:", err);
      alert("Error adding review.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading movie...
      </div>
    );

  if (!movie)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        Movie not found.
      </div>
    );

  const imageBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="container mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={`${imageBase}/${movie.posterUrl}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-full max-h-[500px] object-cover"
          />

          {/* ⭐ Average Rating */}
          <div className="flex items-center mt-2">
            <p className="text-yellow-400 text-2xl mr-2">
              {reviews.length > 0
                ? "⭐".repeat(Math.round(reviews.reduce((a, b) => a + b.rating, 0) / reviews.length))
                : "⭐"}
            </p>
            <span className="text-gray-400">
              ({reviews.length > 0
                ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
                : "0.0"} / 5)
            </span>
          </div>


          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-3 text-gray-400">{movie.description}</p>

            <p className="mt-4"><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Release:</strong> {movie.releaseDate?.slice(0, 10)}</p>
          </div>
        </div>

        {/* ⭐ Review Form */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Rate & Review</h2>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="mt-4 bg-gray-900 p-6 rounded-lg">
              {/* ⭐ Star selector */}
              <div className="flex text-3xl space-x-2 cursor-pointer mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={rating >= star ? "text-yellow-400" : "text-gray-600"}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full bg-gray-800 p-3 rounded text-white"
                rows="3"
                required
              ></textarea>

              <button
                type="submit"
                className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="mt-2 text-gray-400">Login to post a review.</p>
          )}
        </section>

        {/* 🧾 Display Reviews */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">User Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-400">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="bg-gray-900 p-4 rounded-lg mb-4">
                <p className="text-yellow-400">{"⭐".repeat(r.rating)}</p>
                <p className="mt-2">{r.comment}</p>
                <span className="text-gray-500 text-sm">
                  — {r.user?.name || "Unknown"}
                </span>
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MovieDetails;
