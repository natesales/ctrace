import mongoose from 'mongoose'

const PersonSchema = new mongoose.Schema({
    uid: {
        /* lastname+first_initial User ID */

        type: String,
        required: [true, 'Please provide a UID for this Person.']
    },
    current_location: {
        type: Object,
        required: false,
        defaultValue: null
    },
    log: {
        type: Array,
        required: false,
        defaultValue: []
    }
});

export default mongoose.models.Person || mongoose.model('Person', PersonSchema)
