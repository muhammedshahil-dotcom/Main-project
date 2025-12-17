import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../services/movieService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const rowRef = useRef(null);

  const imageBase = import.meta.env.VITE_API_URL;

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data);
      } catch (err) {
        console.error("Error loading movies", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (!movies.length) return;
    const timer = setInterval(
      () => setCurrentIndex((p) => (p + 1) % movies.length),
      5000
    );
    return () => clearInterval(timer);
  }, [movies]);

  const heroMovie = movies[currentIndex];

  const scroll = (dir) => {
    rowRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* 🎬 HERO BANNER */}
      {heroMovie && (
        <div
          className="relative h-[55vh] md:h-[70vh] w-full bg-cover bg-center flex flex-col justify-end px-6 md:px-10 pb-10"
          style={{
            backgroundImage: `url(${imageBase}/${heroMovie.bannerUrl?.replace(/\\/g, "/") || heroMovie.posterUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* SEARCH */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] md:w-1/2 z-20">
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur outline-none"
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl md:text-5xl font-bold">
              {heroMovie.title}
            </h1>

            <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-300 line-clamp-3">
              {heroMovie.description}
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/movies/${heroMovie._id}`)}
                className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
              >
                ⭐ Rate & Review
              </button>

              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
                >
                  🔐 Login
                </button>
              )}
            </div>
          </div>

          {/* DOTS */}
          <div className="absolute bottom-4 right-6 flex gap-2 z-20">
            {movies.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === currentIndex ? "bg-red-500" : "bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 🎥 MOVIE ROW */}
      <section className="mt-10 px-4 md:px-6 relative">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Popular Movies
        </h2>

        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-2 rounded-full"
        >
          <ChevronLeft size={30} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll no-scrollbar scroll-smooth px-2 md:px-10"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => navigate(`/movies/${movie._id}`)}
              className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] cursor-pointer hover:scale-105 transition"
            >
              <img
                src={`${imageBase}/${movie.posterUrl}`}
                className="rounded-lg"
                alt={movie.title}
              />
              <p className="text-center mt-1 text-xs md:text-sm text-gray-300">
                {movie.title}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-2 rounded-full"
        >
          <ChevronRight size={30} />
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
