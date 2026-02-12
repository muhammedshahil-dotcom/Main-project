import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContextBase";
import { getMovieById } from "../services/movieService";
import {
  addReview,
  deleteReview,
  getReviewsByMovie,
  updateReview,
} from "../services/reviewService";

function MovieDetails() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const imageBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const refreshReviews = async () => {
    const reviewData = await getReviewsByMovie(id);
    setReviews(reviewData);
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      setError("");
      try {
        const [movieData, reviewData] = await Promise.all([
          getMovieById(id),
          getReviewsByMovie(id),
        ]);
        setMovie(movieData);
        setReviews(reviewData);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingId) {
        await updateReview(editingId, { rating, comment }, token);
      } else {
        await addReview(id, { rating, comment }, token);
      }
      setRating(0);
      setComment("");
      setEditingId(null);
      await refreshReviews();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save review");
    }
  };

  const onEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const onDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId, token);
      if (editingId === reviewId) {
        setEditingId(null);
        setRating(0);
        setComment("");
      }
      await refreshReviews();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white" />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-12 text-red-400">{error || "Movie not found"}</div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <img
            src={`${imageBase}/${(movie.posterUrl || "").replace(/\\\\/g, "/")}`}
            alt={movie.title}
            className="h-[440px] w-full rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{movie.title}</h1>
            <p className="mt-3 text-gray-300">{movie.description}</p>
            <p className="mt-4 text-sm text-gray-300">
              Genre: {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
            </p>
            <p className="mt-1 text-sm text-gray-300">Release: {movie.releaseDate?.slice(0, 10)}</p>
            <p className="mt-4 text-yellow-400">Average Rating: {averageRating} / 5</p>
          </div>
        </div>

        <section className="mt-10 rounded-xl bg-gray-900 p-5">
          <h2 className="text-xl font-semibold">Rate and Review</h2>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={rating >= star ? "text-yellow-400" : "text-gray-600"}
                  >
                    *
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
                placeholder="Write your review..."
                rows={4}
                required
              />
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700">
                  {editingId ? "Update Review" : "Submit Review"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setRating(0);
                      setComment("");
                    }}
                    className="rounded-lg border border-gray-600 px-4 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p className="mt-2 text-gray-400">Login to post a review.</p>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">User Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              reviews.map((review) => {
                const isOwner = user && review.user?._id === user.id;
                const isAdmin = user?.role === "admin";
                return (
                  <div key={review._id} className="rounded-lg bg-gray-900 p-4">
                    <p className="text-yellow-400">{"*".repeat(review.rating)}</p>
                    <p className="mt-2">{review.comment}</p>
                    <p className="mt-1 text-xs text-gray-500">- {review.user?.name || "Unknown"}</p>
                    {(isOwner || isAdmin) && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => onEdit(review)}
                          className="rounded bg-yellow-600 px-3 py-1 text-sm hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(review._id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MovieDetails;
