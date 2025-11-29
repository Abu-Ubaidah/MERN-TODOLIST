// backend/src/models/todo.model.js

import mongoose, {Schema} from "mongoose";

const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    }
    ,description: {
        type: String,
        required: true
    }
    ,priority: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status:{
        type: String,
        default: "pending"
    },
    visibility:{
        type: String,
        enum:["public", "private"],
        default: "public"
    },
    category: {
        type: String,
        required: true   
    }
    
},{timestamps:true});



export const Todo = mongoose.model("Todo", todoSchema)