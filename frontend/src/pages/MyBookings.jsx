import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContextBase";
import { cancelBooking, getMyBookings } from "../services/bookingService";
import { resolveImageUrl } from "../utils/imageUrl";

const MyBookings = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(bookingId, token);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-gray-300">
            No bookings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="grid gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 md:grid-cols-[90px_1fr_auto]"
              >
                <img
                  src={resolveImageUrl(booking.movie?.posterUrl)}
                  alt={booking.movie?.title || "Movie"}
                  className="h-24 w-20 rounded object-cover"
                />
                <div>
                  <p className="text-lg font-semibold">{booking.movie?.title}</p>
                  <p className="mt-1 text-sm text-gray-300">
                    Show: {new Date(booking.showDate).toLocaleDateString()} at {booking.showTime}
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    Seats: {booking.seats} | Total: Rs. {booking.totalAmount}
                  </p>
                  <p
                    className={`mt-1 text-xs uppercase tracking-wide ${
                      booking.status === "confirmed" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="h-fit rounded bg-red-600 px-3 py-2 text-sm hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
