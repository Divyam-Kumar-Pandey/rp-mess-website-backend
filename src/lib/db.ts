import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connection = mongoose.connection.readyState;

    if (connection === 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (connection === 2) {
        console.log("Connecting to MongoDB");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: "messDatabaseRP",
            bufferCommands: false,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.error(error);
        throw new Error("Error connecting to MongoDB");
    }

}

export default connect;