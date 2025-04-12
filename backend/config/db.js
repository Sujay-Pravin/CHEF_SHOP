import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoUri).then(() => {
        console.log("Connected to MongoDB")
    });
};