const mongoose = require("mongoose")

const movieSchema = new mongoose.schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    description: {
        type: String
    },
    posterUrl: {
        type: String
    },
    trailerUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Movie", movieSchema)