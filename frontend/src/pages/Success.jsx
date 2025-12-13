import { Link } from "react-router-dom";

function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-4">
      <h1 className="text-3xl font-bold text-green-400 mb-4">
        ✅ Password Reset Successful!
      </h1>
      <p className="text-gray-400 text-center max-w-md mb-6">
        Your password has been updated successfully. You can now log in to your account.
      </p>
      <Link
        to="/login"
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default Success;
