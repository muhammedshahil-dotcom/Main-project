import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContextBase";
import { confirmStripePayment } from "../services/bookingService";

const PaymentSuccess = () => {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId || !bookingId || !token) {
        setStatus("failed");
        setMessage("Missing payment details. Please contact support.");
        return;
      }

      try {
        const res = await confirmStripePayment({ bookingId, sessionId }, token);
        setStatus("success");
        setMessage(res.message || "Payment successful and booking confirmed.");
      } catch (err) {
        setStatus("failed");
        setMessage(err?.response?.data?.message || "Payment verification failed.");
      }
    };

    verify();
  }, [sessionId, bookingId, token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg">
        <h1
          className={`mb-4 text-center text-2xl font-bold ${
            status === "success" ? "text-green-400" : status === "failed" ? "text-red-400" : "text-yellow-400"
          }`}
        >
          {status === "success"
            ? "Payment Successful"
            : status === "failed"
            ? "Payment Failed"
            : "Verifying Payment"}
        </h1>
        <p className="mb-6 text-center text-sm text-gray-300">{message}</p>
        <div className="flex justify-center gap-3">
          <Link to="/my-bookings" className="rounded bg-red-600 px-4 py-2 text-sm hover:bg-red-700">
            My Bookings
          </Link>
          <Link to="/" className="rounded border border-gray-600 px-4 py-2 text-sm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
