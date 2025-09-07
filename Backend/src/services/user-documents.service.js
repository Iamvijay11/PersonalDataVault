import DB, { T } from "../database/index.schema.js";
import HttpException from "../exceptions/HttpException.js";
import { isEmpty } from "../utils/util.js";

export default class DocumentService {
    async saveDocument(documentData) {
        if (isEmpty(documentData)) {
            throw new HttpException(400, "Document data is missing");
        }

        const savedDoc = await DB(T.DOCUMENTS_TABLE)
            .insert(documentData)
            .returning("*");
        return savedDoc;
    }

    async getDocumentsByUser(userId) {
        if (!userId) {
            throw new HttpException(400, "User ID is required");
        }

        const docs = await DB(T.DOCUMENTS_TABLE)
            .where({ user_id: userId })
            .orderBy("created_at", "desc");

        return docs;
    }

    async deleteDocumentById(docId, userId) {
        if (!docId || !userId) {
            throw new HttpException(
                400,
                "Document ID and User ID are required"
            );
        }

        const rowsDeleted = await DB(T.DOCUMENTS_TABLE)
            .where({ id: docId, user_id: userId })
            .del();

        if (!rowsDeleted) {
            throw new HttpException(
                404,
                "Document not found or already deleted"
            );
        }

        return { message: "Document deleted successfully" };
    }
}
