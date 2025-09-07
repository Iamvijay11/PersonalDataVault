import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import HttpException from "../exceptions/HttpException.js";

const validationMiddleware = (
    type,
    value = "body",
    skipMissingProperties = false,
    groups = []
) => {
    return (req, res, next) => {
        const instance = plainToInstance(type, req[value]);

        validate(instance, { skipMissingProperties, groups }).then((errors) => {
            if (errors.length > 0) {
                const message = errors
                    .map((error) =>
                        error.constraints
                            ? Object.values(error.constraints).join(", ")
                            : ""
                    )
                    .filter((msg) => msg.length > 0)
                    .join(", ");
                next(new HttpException(400, message));
            } else {
                next();
            }
        });
    };
};

export default validationMiddleware;
