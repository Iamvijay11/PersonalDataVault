import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class GoogleAuthController {
    handleGoogleCallback = async (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: "User not found after authentication",
                });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json(token, { ...user });
        } catch (error) {
            next(error);
        }
    };
}
