import mongoose from 'mongoose';

// TODO: Extract to .env
const MONGO_URI = "mongodb+srv://admin:Uu7e2u3yFi2oQVGBgEUa8pTZACZ3JfE5TNeSnYnwddoyqyesZX8GZuiqtwDtFEKy79vauXFYGpRrn96P6k7ziqJjSdXC7M4DyX7Gy@ctrack-db0.ivwi9.mongodb.net/ctrace?authSource=admin&replicaSet=atlas-jf6fnb-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";

const connection = {} /* creating connection object*/

async function dbConnect() {
    /* check if we have connection to our databse*/
    if (connection.isConnected) {
        return
    }

    /* connecting to our database */
    const db = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })

    connection.isConnected = db.connections[0].readyState
}

export default dbConnect