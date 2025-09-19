import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        JWT_SECRET: str(),
        PORT: port(),
        DATABASE_URL: str(),
    });
};

export default validateEnv;
