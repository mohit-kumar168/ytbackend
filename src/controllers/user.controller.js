import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body;

    if (
        [userName, fullName, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (existingUser) {
        throw new apiError(
            409,
            "User already exists with this username or email"
        );
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new apiError(500, "Failed to upload avatar image");
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new apiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(
            new apiResponse(200, createdUser, "User registered successfully")
        );
});

export { registerUser };
