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

  const imageBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch movies
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

  // Auto banner slide
  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies]);

  const heroMovie = movies[currentIndex];

  const scroll = (dir) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
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

      {/* 🔍 SEARCH INSIDE BANNER */}
      <div className="absolute top-24 left-6 z-20 w-full max-w-md">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black/70 text-white px-4 py-2 rounded-lg outline-none
               placeholder-gray-400 backdrop-blur"
        />
      </div>

      {heroMovie && (
        <div
          className="relative h-[70vh] w-full flex flex-col justify-end p-10 bg-cover bg-center transition-all duration-[1200ms]"
          style={{
            backgroundImage: `url(${imageBase}/${heroMovie.bannerUrl?.replace(
              /\\/g,
              "/"
            ) || heroMovie.posterUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="relative z-10 max-w-xl">
            <h1 className="text-5xl font-bold">{heroMovie.title}</h1>
            <p className="mt-3 text-gray-300 line-clamp-3">
              {heroMovie.description}
            </p>

            <div className="mt-6 space-x-4">
              <button
                onClick={() => navigate(`/movies/${heroMovie._id}`)}
                className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                ⭐ Rate & Review
              </button>

              {!user && (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  🔐 Login
                </button>
              )}
            </div>
          </div>

          {/* Banner dots */}
          <div className="absolute bottom-6 right-10 flex gap-2">
            {movies.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === i ? "bg-red-500" : "bg-gray-500"
                  }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 🎥 MOVIE ROW */}
      <section className="mt-12 px-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>

        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
                      bg-black/70 hover:bg-black p-2 rounded-full"
        >
          <ChevronLeft size={30} />
        </button>

        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth no-scrollbar px-10"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => navigate(`/movies/${movie._id}`)}
              className="min-w-[200px] cursor-pointer transform hover:scale-110 transition"
            >
              <img
                src={`${imageBase}/${movie.posterUrl}`}
                alt={movie.title}
                className="rounded-lg shadow-lg"
              />
              <p className="text-center mt-2 text-gray-300 text-sm">
                {movie.title}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
                      bg-black/70 hover:bg-black p-2 rounded-full"
        >
          <ChevronRight size={30} />
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
