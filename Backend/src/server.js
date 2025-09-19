import "dotenv/config";
import App from "./app.js";
import validateEnv from "./utils/validateEnv.js";
import UserRoute from "./routes/user.route.js";
import GoogleAuthRoute from "./routes/googleAuth.route.js";
import DocumentRoute from "./routes/user-documents.route.js";
import PasswordRoute from "./routes/user-password.route.js";

validateEnv();

try {
    const app = new App([
        new UserRoute(),
        new GoogleAuthRoute(),
        new DocumentRoute(),
        new PasswordRoute(),
    ]);
    app.listen();
} catch (error) {
    console.log("App failed to start:", error);
}
