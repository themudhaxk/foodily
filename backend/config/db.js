import mongoose from "mongoose"

const url = process.env.MONGO_URI;

const connectDB = async () => {
    try { 
        await mongoose.connect(url)
        console.log(`Successfully connected to MongoDB :)`)
    } catch (error) {
        console.error(`ERROR: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB

// node --require dotenv/config backend/index.js