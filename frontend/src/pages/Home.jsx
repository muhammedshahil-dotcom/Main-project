import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies, deleteMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useContext(AuthContext); // ✅ access user & token
  const navigate = useNavigate(); // <-- added

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch movies:", err);
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Handle delete movie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await deleteMovie(id, token);
      setMovies(movies.filter((m) => m._id !== id)); // instantly remove from UI
    } catch (err) {
      console.error("❌ Failed to delete movie:", err);
      alert("Failed to delete movie!");
    }
  };

  const Poster = ({ posterUrl, title }) => {
    const [imageError, setImageError] = useState(false);

    if (!posterUrl || imageError) {
      return (
        <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-gray-500">
          No Poster
        </div>
      );
    }

    // Build safe src:
    let src = "";
    try {
      if (typeof posterUrl === "string" && posterUrl.startsWith("http")) {
        src = posterUrl;
      } else {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
        src = `${base}/${String(posterUrl).replace(/^\/+/, "")}`;
      }
    } catch (err) {
      console.warn("Poster: invalid posterUrl:", posterUrl, err);
      return (
        <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-gray-500">
          No Poster
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={title || "Movie poster"}
        className="w-full h-64 object-cover"
        onError={(e) => {
          // log helpful debugging info so you can inspect the exact URL that 404s
          // open DevTools Network tab and search for this src
          console.warn("Poster load failed:", { posterUrl, src, type: typeof posterUrl });
          setImageError(true);
        }}
      />
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-gray-400 text-lg">Loading movies...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">🎬 All Movies</h1>

        {error ? (
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <p className="text-gray-400 mt-2">
              Please try refreshing the page or come back later.
            </p>
          </div>
        ) : movies.length === 0 ? (
          <p className="text-gray-400 text-center">No movies available</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:scale-105 hover:shadow-xl transition-transform"
              >
                <Poster posterUrl={movie.posterUrl} title={movie.title} />
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {movie.title || "Untitled"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {movie.description || "No description available"}
                  </p>

                  {/* ✅ Show delete button only for Admins */}
                  {user?.role === "admin" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/edit/${movie._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
