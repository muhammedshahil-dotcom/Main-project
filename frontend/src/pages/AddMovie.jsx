import { useState, useContext } from "react";
import { addMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AddMovie() {
  const { token, user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [poster, setPoster] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "admin") {
      setError("Only admins can add movies!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);
    if (poster) formData.append("poster", poster);

    try {
      await addMovie(formData, token);
      setMessage("✅ Movie added successfully!");
      setError("");
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseDate("");
      setPoster(null);
    } catch (err) {
      console.error("❌ Add movie failed:", err);
      setError("Failed to add movie. Try again.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow flex justify-center items-center px-4 py-10">
        <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg border border-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">🎬 Add New Movie</h2>

          {message && <p className="text-green-400 mb-4">{message}</p>}
          {error && <p className="text-red-400 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300">Release Date</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300">Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files[0])}
                className="w-full mt-1 p-2 bg-gray-800 text-white rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition"
            >
              Add Movie
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AddMovie;
