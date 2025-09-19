import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import PasswordController from "../controllers/user-password.controller.js";

export default class PasswordRoute {
    path = "/passwords";
    router = Router();
    controller = new PasswordController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // List passwords (no plaintext in list)
        this.router.get(
            `${this.path}`,
            authMiddleware,
            this.controller.list
        );

        //Add Route
        this.router.post(
            `${this.path}/add`,
            authMiddleware,
            this.controller.add
        );

        // Delete password by id
        this.router.delete(
            `${this.path}/delete/:id`,
            authMiddleware,
            this.controller.remove
        );

        // Reveal plaintext after verifying email in body: { email }
        this.router.post(
            `${this.path}/reveal/:id`,
            authMiddleware,
            this.controller.reveal
        );
    }
}
