import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.route.js"; // ✅ should work
import todoRouter from "./src/routes/todo.route.js"
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import { CORS_IP } from "./constants.js";

export const app = express();

// Middleware
app.use(cors({
    origin: CORS_IP,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", userRouter);
app.use("/api", todoRouter);
// Serve Swagger UI
const swaggerFilePath = path.resolve('./swagger-output.json');
const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
