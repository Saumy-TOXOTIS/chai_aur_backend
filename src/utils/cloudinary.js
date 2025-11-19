import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath)
        {
            return null;
        }
        const response = await cloudinary.uploader.upload(filePath,{resource_type: "auto"});
        console.log("File uploaded to Cloudinary successfully", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(filePath); // Delete the local file in case of error
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

export {uploadOnCloudinary};