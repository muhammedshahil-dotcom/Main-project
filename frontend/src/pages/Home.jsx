import { useEffect, useState } from "react";
import { getAllMovies } from "../services/movieService";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data);
        setError(null); // Clear error on success
      } catch (err) {
        console.error("❌ Failed to fetch movies:", err);
        setError(err.message || "Failed to load movies"); // Set user-friendly error
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Small sub-component to safely render poster images
  const Poster = ({ posterUrl, title }) => {
    const [imageError, setImageError] = useState(false);

    // If there's no poster url or the image failed to load, show fallback
    if (!posterUrl || imageError) {
      return (
        <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-gray-500">
          No Poster
        </div>
      );
    }

    const src = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${posterUrl}`;

    return (
      <img
        src={src}
        alt={title || "Movie poster"}
        className="w-full h-64 object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-gray-400 text-lg">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
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
                {/* Use Poster component instead of direct DOM mutation on error */}
                <Poster posterUrl={movie.posterUrl} title={movie.title} />

                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {movie.title || "Untitled"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {movie.description || "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
