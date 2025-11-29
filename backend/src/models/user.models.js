// backend/src/models/user.model.js
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 2 characters long"],
      index: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        // ✅ Email regex: must contain @, dot, and at least 4 characters before domain
        /^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 8 characters long"],
      match: [
        // ✅ Must include at least one uppercase, one lowercase, one number, one special char
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
    },

    refreshToken: {
        type: String,
        default: null,
    
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next()
});

userSchema.methods.isPasswordCorrect = async function 
(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15min"
    }
  )
}
userSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
    }
  )
}

export const User = mongoose.model("User", userSchema);
