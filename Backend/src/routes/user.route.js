import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import UserController from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

export default class UserRoute {
    path = "/users";
    router = Router();
    controller = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // User Signup
        this.router.post(
            `${this.path}/signup`,
            authMiddleware,
            this.controller.registerUser
        );

        //User Login
        this.router.post(
            `${this.path}/login`,
            authMiddleware,
            this.controller.loginUser
        );

        // Current User
        this.router.get(
            `${this.path}/me`,
            authMiddleware,
            this.controller.getCurrentUser
        );

        // update profile
        this.router.put(
            `${this.path}/update/:id`,
            authMiddleware,
            upload.single("profile_image_url"),
            this.controller.updateUser
        );

        // User Logout
        this.router.post(`${this.path}/logout`, this.controller.logoutUser);
    }
}
