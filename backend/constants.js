// backend/constants.js
import dotenv from "dotenv";
dotenv.config();
export const DB_NAME = process.env.DB_NAME;
export const DB_URI = process.env.MONGODB_URI;
export const CORS_IP = process.env.CORS_ORIGIN_IP;
export const PORT = process.env.PORT;