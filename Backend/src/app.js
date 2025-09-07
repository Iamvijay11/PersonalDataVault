import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";
import authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { logger, stream } from "./utils/logger.js";
import passport from "passport";
import "./services/passport.js";

class App {
    constructor(routes) {
        this.app = express();
        this.port = process.env.PORT || 8000;
        this.env = process.env.NODE_ENV || "development";

        this.app.use(cookieParser());
        this.app.use(
            cors({
                origin: "http://localhost:5173",
                credentials: true,
            })
        );

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();

        // Default root route
        this.app.get("/", (req, res) => {
            res.send("Welcome to Personal Vault API");
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`✅ App listening on the port ${this.port}...`);
        });
    }

    getServer() {
        return this.app;
    }

    initializeMiddlewares() {
        // ✅ JSON parser must be first
        this.app.use(express.json({ limit: "2gb" }));
        this.app.use(express.urlencoded({ limit: "2gb", extended: true }));

        // ✅ Security & logging middlewares
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(
            morgan(this.env === "production" ? "combined" : "dev", { stream })
        );
        this.app.use(passport.initialize());
    }

    initializeRoutes(routes) {
        // ✅ Mount all routes BEFORE global auth middleware
        routes.forEach((route) => {
            this.app.use("/api/v1", route.router);
        });

        // 🛡 Optional: Apply auth globally to all `/api/v1` routes *after* open ones (like login/signup)
        this.app.use("/api/v1", authMiddleware);
    }

    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
