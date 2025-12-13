import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white text-center px-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-6">Page not found</p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
