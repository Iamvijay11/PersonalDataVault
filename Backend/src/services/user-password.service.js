import crypto from "crypto";
import DB, { T } from "../database/index.schema.js";
import HttpException from "../exceptions/HttpException.js";

const getKey = () => {
    // 32 bytes for AES-256
    const secret =
        process.env.PASSWORD_SECRET ||
        "dev_default_password_secret_change_me";
    return crypto.createHash("sha256").update(secret).digest();
};

const encrypt = (plaintext) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
    const enc = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
    ]);
    // store "ivHex:cipherHex"
    return `${iv.toString("hex")}:${enc.toString("hex")}`;
};

const decrypt = (payload) => {
    const [ivHex, dataHex] = String(payload).split(":");
    if (!ivHex || !dataHex) throw new Error("Invalid encrypted payload");
    const iv = Buffer.from(ivHex, "hex");
    const enc = Buffer.from(dataHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString("utf8");
};

export default class PasswordService {
    async listByUser(userId) {
        const rows = await DB(T.PASSWORD_TABLE)
            .where({ user_id: userId })
            .select(
                "id",
                "title",
                "website_url",
                "email_or_username",
                "created_at",
                "updated_at"
            )
            .orderBy("id", "asc");
        return rows;
    }

    async add(
        userId,
        { title, website_url, email_or_username, password }
    ) {
        if (!title) {
            throw new HttpException(400, "Title is required");
        }
        if (!email_or_username || !password) {
            throw new HttpException(
                400,
                "Username/Email and password are required"
            );
        }
        const record = {
            user_id: userId,
            title,
            website_url: website_url || null,
            email_or_username,
            password_encrypted: encrypt(password),
        };
        const [inserted] = await DB(T.PASSWORD_TABLE)
            .insert(record)
            .returning([
                "id",
                "title",
                "website_url",
                "email_or_username",
                "created_at",
                "updated_at",
            ]);
        return inserted;
    }

    async remove(userId, id) {
        const deleted = await DB(T.PASSWORD_TABLE)
            .where({ id, user_id: userId })
            .del();
        if (!deleted)
            throw new HttpException(404, "Password entry not found");
        return { success: true };
    }

    async reveal(user, id, email) {
        if (!email || email !== user.email) {
            throw new HttpException(401, "Email verification failed");
        }
        const row = await DB(T.PASSWORD_TABLE)
            .where({ id, user_id: user.id })
            .first();
        if (!row) throw new HttpException(404, "Password entry not found");
        const plaintext = decrypt(row.password_encrypted);
        return { id: row.id, password: plaintext };
    }
}
