import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //get user details
    console.log("req.body: ", req.body);
    const {fullname, email, username, password} = req.body;

    //validation - not empty
    if([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    //check if user already exists: username, email
    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    });
    if(existingUser) {
        throw new ApiError(409, "User with given email or username already exists");
    }

    //check for images, check for avatar
    console.log("req.files: ", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    //upload them to cloudinary, avatar
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrl = uploadOnCloudinary(coverImageLocalPath);
    if(!avatarUrl) {
        throw new ApiError(500, "Could not upload avatar image");
    }

    //create user object - create entry in db
    const newUser = await User.create({
        fullname,
        avatar: avatarUrl.url,
        coverImage: coverImageUrl?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );

    //check for user creation
    if(!createdUser) {
        throw new ApiError(500, "Could not create user");
    }
    
    //return res
    return res.status(201).json(new ApiResponse(
        201,
        createdUser,
        "User registered successfully"
    ));
})

export { registerUser };