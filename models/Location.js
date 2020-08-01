const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please specify Location's name"],
        unique: true
    },
    max_occupancy: {
        type: Number,
        required: true
    },
    current_occupancy: {
        type: Number,
        required: false,
        defaultValue: 0
    }
})

module.exports = mongoose.models.Location || mongoose.model("Location", LocationSchema)
