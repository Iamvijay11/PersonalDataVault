import { Router } from "express";
import passport from "passport";
import GoogleAuthController from "../controllers/googleAuth.controller.js";

export default class GoogleAuthRoute {
    constructor() {
        this.path = "/auth";
        this.router = Router();
        this.googleAuthController = new GoogleAuthController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            `${this.path}/google`,
            passport.authenticate("google", { scope: ["profile", "email"] })
        );

        this.router.get(
            `${this.path}/google/callback`,
            passport.authenticate("google", {
                session: false,
                failureRedirect: `${this.path}/google/failure`,
            }),
            this.googleAuthController.handleGoogleCallback
            
        );

        this.router.get(`${this.path}/google/failure`, (req, res) => {
            res.status(401).json({ message: "Google authentication failed" });
        });
    }
}
