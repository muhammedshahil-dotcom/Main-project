import { useState, useContext } from "react";
import { addMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddMovie() {
  const { user, token } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [poster, setPoster] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(null);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || user?.role !== "admin") {
      setError("❌ Only Admins Can Add Movies!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);

    if (poster) formData.append("poster", poster);
    if (banner) formData.append("banner", banner);

    if (gallery.length > 0) {
      for (let img of gallery) {
        formData.append("gallery", img);
      }
    }

    try {
      await addMovie(formData, token);
      setMessage("🎉 Movie added successfully!");
      setError("");
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseDate("");
      setPoster(null);
      setGallery([]);
    } catch {
      setError("❌ Failed to add movie. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-grow px-5 md:px-10 py-10">
        <div className="max-w-3xl mx-auto bg-[#141414] p-10 rounded-2xl border border-gray-800 shadow-[0_0_40px_#000]">

          <h1 className="text-3xl font-extrabold mb-6 tracking-wide text-red-600">
            🎬 Add Movie (Admin Panel)
          </h1>

          {message && <p className="text-green-400 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              placeholder="Movie Title"
              className="w-full bg-[#1f1f1f] p-3 rounded-lg outline-none border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Movie Description"
              className="w-full bg-[#1f1f1f] p-3 h-28 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              placeholder="Genre (ex: Action, Drama, Thriller)"
              className="w-full bg-[#1f1f1f] p-3 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-red-600"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />

            <input
              type="date"
              className="w-full bg-[#1f1f1f] p-3 rounded-lg border border-gray-700 text-white focus:ring-2 focus:ring-red-600"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />

            <div>
              <label className="block text-gray-300">Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files[0])}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300">Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBanner(e.target.files[0])}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300">Gallery (Max 10)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGallery([...e.target.files])}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none"
              />
            </div>


            <button
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition duration-150 disabled:bg-gray-700"
            >
              {loading ? "Uploading..." : "Add Movie"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
