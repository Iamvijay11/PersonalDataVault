import PasswordService from "../services/user-password.service.js";

export default class PasswordController {
    constructor() {
        this.passwordService = new PasswordService();
    }

    list = async (req, res, next) => {
        try {
            const data = await this.passwordService.listByUser(req.user.id);
            res.status(200).json({ message: "Passwords fetched", data });
        } catch (e) {
            next(e);
        }
    };

    add = async (req, res, next) => {
        try {
            const { title, website, username, password } = req.body || {};
            const payload = {
                title, // required
                website_url: website || null,
                email_or_username: username,
                password,
            };
            const data = await this.passwordService.add(req.user.id, payload);
            res.status(201).json({ message: "Password saved", data });
        } catch (e) {
            next(e);
        }
    };

    remove = async (req, res, next) => {
        try {
            await this.passwordService.remove(req.user.id, req.params.id);
            res.status(200).json({ message: "Password deleted" });
        } catch (e) {
            next(e);
        }
    };

    reveal = async (req, res, next) => {
        try {
            const { email } = req.body || {};
            const data = await this.passwordService.reveal(req.user, req.params.id, email);
            res.status(200).json({ message: "Password revealed", data });
        } catch (e) {
            next(e);
        }
    };
}
