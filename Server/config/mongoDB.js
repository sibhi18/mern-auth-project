const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error("MONGO_URI is missing. Add it to Server/.env, for example: MONGO_URI=mongodb+srv://username:password@cluster0.758n3pc.mongodb.net/mern-auth");
    }

    mongoose.connection.on("connected", () => console.log("DB Connected"));
    mongoose.connection.on("error", (err) => console.error("DB connection error:", err.message));
    mongoose.connection.on("disconnected", () => console.log("DB disconnected"));

    await mongoose.connect(mongoURI, { dbName: "mern-auth" });
};

module.exports = connectDB;