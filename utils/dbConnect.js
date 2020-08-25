import mongoose from "mongoose";
import config from "lib/config";

// TODO: Extract to .env
const MONGO_URI = config.MONGO_URI;
const connection = {}

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    const db = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })

    connection.isConnected = db.connections[0].readyState;
}

export default dbConnect
