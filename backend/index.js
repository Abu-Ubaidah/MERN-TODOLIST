// backend/index.js
import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js"
import { connectDB } from "./src/db/index.js";
import {PORT} from "./constants.js"


connectDB()
    .then(()=>{
        app.listen(PORT || 4000, ()=>{
            console.log("Mongo DB Connection Succesfull");
            console.log(`server running on port: ${PORT || 4000}`);
        });
    })
    .catch((err)=>{
        console.log("Mongo DB Connection Error")
    });