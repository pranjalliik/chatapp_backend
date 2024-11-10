import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Connected to MongoDB");
    } catch(error) {
        console.log("Error in connecting to MongoDB", error.message);
    }
}

export default connectToMongoDB