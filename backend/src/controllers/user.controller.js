// backend/src/conrollers/user.controller.js
import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404, "User Doesn't Exist")
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false});

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}

export const registerUser = asyncHandler(async (req,res)=>{
    
        const {name , email, password} = req.body;
        
        if(!name || !email || !password){
            throw new ApiError (400, "All fields are required");
        }
        const exisingUser = await User.findOne({
            $or: [{name: name.toLowerCase()}, {email: email.toLowerCase()}]
        });
    
        if(exisingUser){
            throw new ApiError(409, "User already exists");
        }
    
        const user = await User.create({
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            password,
        });
    
        const createdUser = await User.findById(user._id).
        select("-password -refreshToken");
        if (!createdUser) {
          throw new ApiError(500, "Server error while fetching created user");
        }
        
         res.status(201).json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
    
});

export const loginUser = asyncHandler( async (req, res)=>{
  
        const { identifier , password} = req.body;
        const query = identifier.includes("@") ? {email : identifier.toLowerCase()} : {name : identifier.toLowerCase()}
        const user = await User.findOne(query);

        if(!user){
            throw new ApiError(404,  "User Doesn't exists");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Credentials");
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            path: "/"
        }


        res.status(200).
        cookie("refreshToken",refreshToken,options).
        json(new ApiResponse(200, 
            {
              user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    );
    

});

export const logoutUser = asyncHandler( async(req,res)=>{

    if (!req.user) {
      throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    await User.findByIdAndUpdate(req.user._id,
    {
        $set: {
            refreshToken: undefined,
        }
    },
        {
            new: true,
        },
    );

    const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }
    
    return res.status(200)
    .clearCookie("refreshToken", options)
    // .clearCookie("accessToken", options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))
});


export const getUser = asyncHandler(async(req,res)=>{
        const user = req.user;

        if (!user){
            throw new ApiError(401, "Unauthorized: Access.")
        }

        res.status(200).json( new ApiResponse(200, {user}, "Got User Successfully"))
})

export const refreshUser = asyncHandler(async(req,res)=>{
    const user = req.user;
    if (!user){
        throw new ApiError(404, "User Doesn't Exist ")
    }
    
    const newaccessToken = user.generateAccessToken();

    res.status(200).json(new ApiResponse(200, {newaccessToken}, "access token refresh successfully"))
})