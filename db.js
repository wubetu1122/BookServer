import mongoose from "mongoose";
import env from 'dotenv';

env.config();
const MONGO_URI = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit process if unable to connect
    }
};

export default connectDB;
