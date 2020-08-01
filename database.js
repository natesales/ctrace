import mongoose from 'mongoose';

async function connect() {
    const db = await mongoose.connect(config.database, {useUnifiedTopology: true, useNewUrlParser: true});
    const connection = db.connections[0];

    console.log(connection.readyState);
}