import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import HttpException from "../exceptions/HttpException.js";
import DB, { T } from "../database/index.schema.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;

                if (!email || !firstName || !lastName) {
                    return done(
                        new HttpException(
                            401,
                            "Required user data missing from Google profile"
                        ),
                        null
                    );
                }

                let user = await DB(T.USERS_TABLE).where({ email }).first();

                if (!user) {
                    const newUser = {
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        username:
                            email.split("@")[0] +
                            "_" +
                            Math.floor(Math.random() * 10000),
                    };

                    const [insertedUser] = await DB(T.USERS_TABLE)
                        .insert(newUser)
                        .returning("*");

                    user = insertedUser;
                }

                return done(null, user);
            } catch (error) {
                console.error("Google Auth Error:", error);
                return done(
                    new HttpException(500, "Internal Server Error"),
                    null
                );
            }
        }
    )
);

export default passport;
