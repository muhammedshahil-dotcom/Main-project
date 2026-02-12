import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllMovies, searchMovies } from "../services/movieService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import { resolveImageUrl } from "../utils/imageUrl";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const data = searchQuery ? await searchMovies(searchQuery) : await getAllMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load movies");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  useEffect(() => {
    if (!movies.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  const heroMovie = useMemo(() => movies[currentIndex] || null, [movies, currentIndex]);

  const scroll = (direction) => {
    rowRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {heroMovie && !searchQuery && (
        <div
          className="relative flex h-[55vh] w-full flex-col justify-end bg-cover bg-center px-5 pb-10 md:h-[70vh] md:px-10"
          style={{
            backgroundImage: `url(${resolveImageUrl(heroMovie.bannerUrl || heroMovie.posterUrl)})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold md:text-5xl">{heroMovie.title}</h1>
            <p className="mt-3 line-clamp-3 text-sm text-gray-300 md:text-base">{heroMovie.description}</p>
            <button
              onClick={() => navigate(`/movies/${heroMovie._id}`)}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 hover:bg-red-700"
            >
              Rate and Review
            </button>
          </div>
        </div>
      )}

      <section className="relative mx-auto mt-8 w-full max-w-7xl px-4 pb-10 md:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">
            {searchQuery ? `Results for "${searchQuery}"` : "Popular Movies"}
          </h2>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-700 bg-red-950/40 p-4 text-red-300">{error}</div>
        ) : loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center text-gray-300">
            Movie not found
          </div>
        ) : (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2 md:flex"
            >
              <ChevronLeft size={28} />
            </button>
            <div ref={rowRef} className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-1 md:px-9">
              {movies.map((movie) => (
                <button
                  key={movie._id}
                  onClick={() => navigate(`/movies/${movie._id}`)}
                  className="min-w-[140px] cursor-pointer text-left transition hover:scale-105 sm:min-w-[180px] md:min-w-[210px]"
                >
                  <img
                    src={resolveImageUrl(movie.posterUrl)}
                    className="h-[210px] w-full rounded-lg object-cover sm:h-[270px] md:h-[310px]"
                    alt={movie.title}
                  />
                  <p className="mt-2 text-center text-sm text-gray-300">{movie.title}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/80 p-2 md:flex"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Home;
