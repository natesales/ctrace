import mongoose from 'mongoose'

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
    log: {
        type: Array,
        required: false,
        default: []
    },
    current_occupancy: {
        type: Number,
        default: 0
    }
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
