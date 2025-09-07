import DocumentService from "../services/user-documents.service.js";
import HttpException from "../exceptions/HttpException.js";
import { uploadFileToS3 } from "../utils/aws.util.js";

export default class DocumentController {
    constructor() {
        this.documentService = new DocumentService();
    }

    uploadDocument = async (req, res, next) => {
        try {
            const user = req.user;
            const { category } = req.body;

            if (!req.file) {
                throw new HttpException(400, "No file provided");
            }

            if (!category) {
                throw new HttpException(400, "Category is required");
            }
            const file = req.file;

            const fileUrl = await uploadFileToS3(
                file.buffer,
                file.originalname,
                file.mimetype,
                parseInt(user.id),
                "documents"
            );

            const savedDocument = await this.documentService.saveDocument({
                user_id: user.id,
                filename: file.originalname,
                file_type: file.mimetype,
                file_url: fileUrl,
                category: category.trim(),
            });

            res.status(201).json({
                message: "File uploaded successfully",
                data: savedDocument,
            });
        } catch (error) {
            console.error("Error in uploadDocument:", error.message);
            next(error);
        }
    };

    getUserDocuments = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const documents = await this.documentService.getDocumentsByUser(
                userId
            );

            res.status(200).json({
                message: "User documents fetched",
                data: documents,
            });
        } catch (error) {
            console.error("Error in getUserDocuments:", error.message);
            next(error);
        }
    };

    deleteDocument = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const docId = req.params.id;

            const deleted = await this.documentService.deleteDocumentById(
                docId,
                userId
            );

            if (!deleted) {
                throw new HttpException(
                    404,
                    "Document not found or not owned by user"
                );
            }

            res.status(200).json({
                message: "Document deleted successfully",
            });
        } catch (error) {
            console.error("Error in deleteDocument:", error.message);
            next(error);
        }
    };
}
