import mongoose from 'mongoose'

const PersonSchema = new mongoose.Schema({
    uid: {
        /* lastname+first_initial User ID */

        type: String,
        required: [true, 'Please provide a UID for this Person.']
    },
    log: {
        type: Array,
        required: false,
        default: []
    },
    pinned_locations: {
        type: Array,
        required: false,
        default: []
    },
    createdAt: {
        type: Object
    }
});

export default mongoose.models.Person || mongoose.model('Person', PersonSchema)
