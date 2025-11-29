// backend/src/middlewares/auth.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler( async(req,res,next) =>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ","");
    
        if(!token) throw new ApiError(401,"Unauthorized request");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken._id){
            throw new ApiError(403 , "Invalid or expired Access Token");
        }
    
        const user  = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401 , "User not found")
        }
    
        req.user = user;
        next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token"); 
    } 
}); 

export const verifyRefreshToken = asyncHandler( async(req,res,next) =>{
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken){
            throw new ApiError(401, "Refresh Tokem missing");
        }
        
    
        const decodedRefToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        if(!decodedRefToken._id){
            throw new ApiError(403 , "Invalid or expired refresh Token");
        }
           
        const user = await User.findById(decodedRefToken?._id).select("-password");
        if(!user){
            throw new ApiError(401 , "User not Found")
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(403, "Refresh token mismatch");
        }


        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
});