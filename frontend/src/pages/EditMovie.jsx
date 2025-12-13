import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById, updateMovie } from "../services/movieService";
import { AuthContext } from "../context/AuthContext";

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

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieById(id);
        setMovie(data);
        setTitle(data.title);
        setDescription(data.description);
        setGenre(data.genre);
        setReleaseDate(data.releaseDate?.split("T")[0]);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role !== "admin") return alert("Only admin can edit movies.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseDate", releaseDate);

    if (poster) {
      formData.append("poster", poster);
    }

    if (banner) {
      formData.append("banner", banner);
    }

    try {
      await updateMovie(id, formData, token);
      alert("Movie updated successfully!");
      navigate("/admin/movies");
    } catch (err) {
      alert("Failed to update movie");
      console.log(err);
    }
  };

  if (!movie) return <p className="text-center text-gray-400 mt-10">Loading movie details...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">✏️ Edit Movie</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800"
      >
        <label className="block mb-4">
          Title:
          <input
            type="text"
            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="block mb-4">
          Description:
          <textarea
            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </label>

        <label className="block mb-4">
          Genre:
          <input
            type="text"
            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          Release Date:
          <input
            type="date"
            className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </label>

        <label className="block mb-6">
          Poster Image:
          <input
            type="file"
            accept="image/*"
            className="w-full mt-1 text-gray-400"
            onChange={(e) => setPoster(e.target.files[0])}
          />
        </label>

        <label className="block mb-2">Current Banner:</label>
        <img
          src={`${import.meta.env.VITE_API_URL}/${movie.bannerUrl}`}
          alt="banner"
          className="w-full h-40 object-cover rounded-md mb-4"
        />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload New Banner</label>
          <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditMovie;
