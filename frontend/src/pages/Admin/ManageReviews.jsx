import { useContext, useEffect, useState } from "react";
import { deleteReview } from "../../services/reviewService";
import { getAdminReviews } from "../../services/adminService";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../../components/AdminLayout";

const ManageReviews = () => {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAdminReviews(token);
        setReviews(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id, token);
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <AdminLayout title="Manage Reviews">
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading reviews...</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-lg border border-gray-800 bg-black/40 p-4">
              <p className="text-yellow-400">{"*".repeat(review.rating)}</p>
              <p className="mt-2">{review.comment}</p>
              <p className="mt-2 text-xs text-gray-400">
                Movie: {review.movie?.title || "Unknown"} | User: {review.user?.name || "Unknown"}
              </p>
              <button
                onClick={() => handleDelete(review._id)}
                className="mt-3 rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-400">No reviews found.</p>}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageReviews;
