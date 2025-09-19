import jwt from "jsonwebtoken";
import UserService from "../services/user.service.js";
import HttpException from "../exceptions/HttpException.js";
import { uploadFileToS3 } from "../utils/aws.util.js";

export default class UserController {
    constructor() {
        this.userService = new UserService();
    }

    registerUser = async (req, res, next) => {
        try {
            const userData = req.body;
            console.log("User registration attempt:", userData);

            if (!userData.password) {
                throw new HttpException(400, "Password is missing");
            }

            const newUser = await this.userService.register(userData);

            res.status(201).json({
                message: "User registered successfully",
                data: newUser,
            });
        } catch (error) {
            console.error("Error in registerUser:", error.message);
            next(error);
        }
    };

    loginUser = async (req, res, next) => {
        try {
            const userData = req.body;

            const user = await this.userService.login(userData);

            // ✅ Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
            );

            // ✅ Set HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });

            // ✅ Return user (optional) - REMOVED token from response
            res.status(200).json({
                message: "Login successful",
                token,
                data: {
                    ...user,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    logoutUser = async (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Logged out successfully" });
    };

    getCurrentUser = async (req, res, next) => {
        try {
            const user = req.user;
            res.status(200).json({
                message: "User profile fetched successfully",
                data: {
                    ...user,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const user = req.user;
            const updatedData = req.body;

            if (req.file) {
                const imageUrl = await uploadFileToS3(
                    req.file.buffer,
                    req.file.originalname,
                    req.file.mimetype,
                    parseInt(user.id),
                    "profile"
                );
                updatedData.profile_image_url = imageUrl;
            }

            const updatedUser = await this.userService.UpdateUser(
                user.id,
                updatedData
            );

            // Check if user was found and updated
            if (!updatedUser) {
                throw new HttpException(
                    404,
                    "User not found or no changes made."
                );
            }

            res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            console.error("Error in updateUser:", error.message);
            next(error);
        }
    };
}
