const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: [true, "Please specify person's UID"],
        unique: true
    },
    current_location: {
        type: Object,
        required: false,
        defaultValue: null
    }
})

module.exports = mongoose.models.Person || mongoose.model("Person", PersonSchema)
