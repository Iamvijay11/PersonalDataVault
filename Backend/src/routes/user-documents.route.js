import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import DocumentController from "../controllers/user-document.controller.js";

export default class DocumentRoute {
    path = "/users/documents";
    router = Router();
    controller = new DocumentController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Upload document
        this.router.post(
            `${this.path}/upload-document`,
            authMiddleware,
            upload.single("documents"),
            this.controller.uploadDocument
        );

        // Get user documents
        this.router.get(
            `${this.path}/get`,
            authMiddleware,
            this.controller.getUserDocuments
        );

        // Delete document
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.controller.deleteDocument
        );
    }
}
