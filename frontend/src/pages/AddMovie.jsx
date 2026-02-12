import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContextBase";
import AdminLayout from "../components/AdminLayout";

export default function AddMovie() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [poster, setPoster] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || user?.role !== "admin") {
      setError("Only admins can add movies");
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
    gallery.forEach((image) => formData.append("gallery", image));

    try {
      await addMovie(formData, token);
      navigate("/admin/movies");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Movie">
      {error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-950/40 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input
          placeholder="Movie Title"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Movie Description"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />
        <input
          placeholder="Genre (e.g. Action, Drama)"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} />
        <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files?.[0] || null)} />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setGallery(Array.from(e.target.files || []))}
        />
        <button
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-700 disabled:bg-gray-700"
        >
          {loading ? "Saving..." : "Add Movie"}
        </button>
      </form>
    </AdminLayout>
  );
}
