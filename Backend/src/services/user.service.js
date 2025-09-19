import DB, { T } from "../database/index.schema.js";
import { isEmpty } from "../utils/util.js";
import HttpException from "../exceptions/HttpException.js";
import bcrypt from "bcrypt";

export default class UserService {
    async register(userData) {
        if (isEmpty(userData))
            throw new HttpException(400, "User data is missing");

        const existing = await DB(T.USERS_TABLE)
            .where({ email: userData.email })
            .first();

        if (existing) throw new HttpException(409, "User already exists");

        const { password, ...data } = userData;

        if (!password)
            throw new HttpException(400, "Password is required");

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            ...data,
            password_hash: hashedPassword,
        };

        const result = await DB(T.USERS_TABLE)
            .insert(newUser)
            .returning("*");

        return result[0];
    }

    async login(userData) {
        const payload = userData.identifier ? userData : userData.userData;

        const { identifier, password } = payload || {};

        if (!identifier || !password) {
            throw new HttpException(
                400,
                "Email/Username and password are required"
            );
        }
        console.log("User login attempt:", { identifier });

        const user = await DB(T.USERS_TABLE)
            .where("email", identifier)
            .orWhere("username", identifier)
            .first();

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new HttpException(401, "Invalid credentials");
        }

        // Optional: remove password_hash before returning
        delete user.password_hash;
        console.log("User in login:", user);
        return user;
    }

    async findUserById(user_id) {
        // Accept either a primitive id or a where-hash object
        const criteria =
            user_id && typeof user_id === "object"
                ? user_id
                : { id: user_id };

        const user = await DB(T.USERS_TABLE).where(criteria).first();

        if (!user) {
            return null;
        }

        // Remove sensitive fields if present
        delete user.password_hash;
        return user;
    }

    async UpdateUser(id, updateData) {
        if (!id) {
            throw new HttpException(400, "User ID  are required");
        }

        if (isEmpty(updateData)) {
            throw new HttpException(400, "User update data are required");
        }

        //  Restrict email from being updated
        if (updateData.email) {
            throw new HttpException(400, "Email update is not allowed");
        }

        //  Prevent direct password update
        if (updateData.password || updateData.password_hash) {
            throw new HttpException(
                400,
                "Use change password route to update password"
            );
        }

        // Optional: If updating username, ensure it's not taken by another user
        if (updateData.username) {
            const existingUser = await DB(T.USERS_TABLE)
                .where({ username: updateData.username })
                .andWhereNot({ id })
                .first();

            if (existingUser) {
                throw new HttpException(
                    409,
                    "Username is already taken, try another combination."
                );
            }
        }

        const updated = await DB(T.USERS_TABLE)
            .where({ id })
            .update({
                ...updateData,
                updated_at: new Date().toISOString(),
            })
            .returning("*");

        if (!updated.length) {
            throw new HttpException(
                404,
                "User not found or update failed"
            );
        }

        delete updated[0].password_hash; // Remove sensitive field
        return updated[0];
    }

    async deleteUser(id) {
        const deleted = await DB(T.USERS_TABLE).where({ id }).del();
        if (!deleted)
            throw new HttpException(
                404,
                "User not found or already deleted"
            );
        return { message: "User deleted successfully" };
    }
}
