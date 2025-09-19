import jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException.js";
import DB from "../database/index.schema.js";
import UserService from "../services/user.service.js";

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check token in headers (case-insensitive) or cookies
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Invalid token payload. User identifier is missing.",
            });
        }

        // ✅ FIX: Explicitly parse the user ID to an integer and validate it.
        // This prevents data type mismatches when querying the database.
        const userId = parseInt(decoded.id, 10);
        if (isNaN(userId)) {
            return res.status(401).json({
                message: "Invalid token. User identifier is malformed.",
            });
        }

        // Fetch user using the validated ID
        const userService = new UserService();
        const user = await userService.findUserById(userId);

        if (!user) {
            return res.status(401).json({
                message: "Invalid token. User not found.",
            });
        }

        await DB.raw(`SET search_path TO public`);

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }

        next(new HttpException(401, "Authentication failed."));
    }
};

export default authMiddleware;

