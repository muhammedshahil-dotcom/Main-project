
import Movie from "../models/Movie.js"

//Add movie
export const addMovie = async (req, res) => {
    try {
        const { title, description, releaseDate, genre } = req.body

        const movie = new Movie({
            title,
            description,
            releaseDate,
            genre,
            posterUrl: req.file ? req.file.path : null,
        })

        await movie.save();
        res.status(201).json({ message: "Movie added successfully", movie });

    } catch (error) {
        res.status(500).json({ message: "Failed to add movie", error: error.message });
    }
}

//Get all movies
export const  getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate("genre")
        res.json(movies)
    } catch (error) {
        res.status(500).json({ message: "Failed to get movies", error: error.message });
    }
}