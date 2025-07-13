import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "ytbackend") => {
    try {
        if (!localFilePath) return null;

        // Info: Uploading a file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folder,
        });
        // console.log("File uploaded on Cloudinary successfully: ", response.url);
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Info: If there's an error, delete the local file
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const removeFromCloudinary = async (cloudinaryUrl, resourceType = "image") => {
    try {
        if (!cloudinaryUrl) return null;
        const parts = cloudinaryUrl.split("/");
        const uploadIndex = parts.findIndex((part) => part === "upload");
        const pathAfterUpload = parts.slice(uploadIndex + 1).join("/");
        const lastDotIndex = pathAfterUpload.lastDotOf(".");
        const publicId = pathAfterUpload.substring(0, lastDotIndex);

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary, removeFromCloudinary };
