import jwt from "jsonwebtoken";
import HttpException from "../exceptions/HttpException.js";
import DB from "../database/index.schema.js";

const authMiddleware = async (req, res, next) => {
    // console.log("I am running.");

    try {
        //if (req.path.includes('/users/insertusers') || req.path.includes('/public')) {
        if (req.path.includes("/users/login")) {
            await DB.raw("SET search_path TO vault");
            return next();
        }

        const bearerHeader = req.headers["authorization"];

        if (bearerHeader) {
            const bearer = bearerHeader.split(" ");
            console.log(JSON.stringify(bearer));
            const bearerToken = bearer[1];
            console.log(bearerToken);
            if (bearerToken != "null") {
                console.log("in if for null");
                const secret = process.env.JWT_SECRET;
                const verificationResponse = jwt.verify(bearerToken, secret);

                if (verificationResponse) {
                    req.user = verificationResponse;
                    console.log(bearer[2]);
                    if (bearer[2] != null || bearer[2] != undefined) {
                        console.log(
                            DB.raw(
                                "Hii SET search_path TO " + bearer[2]
                            ).toString()
                        );
                        await DB.raw("SET search_path TO " + bearer[2]);
                    } else {
                        console.log("in public");
                        await DB.raw("SET search_path TO vault");
                    }
                    next();
                } else {
                    next(new HttpException(401, "UnAuthorized User"));
                }
            } else {
                console.log("inelse");
                await DB.raw("SET search_path TO " + bearer[2]);
                next();
            }
        } else {
            next(new HttpException(404, "Authentication token missing"));
        }
    } catch (error) {
        next(new HttpException(401, "Wrong authentication token"));
    }
};

export default authMiddleware;
