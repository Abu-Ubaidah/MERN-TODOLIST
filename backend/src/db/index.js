// backend/src/db/index.js
import mongoose from "mongoose";
import { DB_URI, DB_NAME } from "../../constants.js";


export const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`);
        console.log(`\nConnected to MongoDB! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED: ", error);
        process.exit(1);
    }


}
