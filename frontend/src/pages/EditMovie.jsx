import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById, updateMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContextBase";
import AdminLayout from "../components/AdminLayout";

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [poster, setPoster] = useState(null);
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id);
        setMovie(data);
        setTitle(data.title || "");
        setDescription(data.description || "");
        setGenre(Array.isArray(data.genre) ? data.genre.join(", ") : data.genre || "");
        setReleaseDate(data.releaseDate?.split("T")[0] || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch movie");
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== "admin") {
      setError("Only admin can edit movies.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);
    if (poster) formData.append("poster", poster);
    if (banner) formData.append("banner", banner);

    try {
      await updateMovie(id, formData, token);
      navigate("/admin/movies");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit Movie">
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {!movie ? (
        <p className="text-gray-400">Loading movie details...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
          <input
            type="text"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <input
            type="date"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} />
          <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] || null)} />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:bg-gray-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}

export default EditMovie;
