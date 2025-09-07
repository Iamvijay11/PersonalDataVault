import DB, { T } from "./index.schema.js";

export const PASSWORD_TABLE = "passwords";

export const seed = async (dropFirst = false) => {
    try {
        if (dropFirst) {
            console.log("Dropping Passwords Table...");
            await DB.schema.dropTableIfExists(PASSWORD_TABLE);
            console.log("Dropped Passwords Table!");
        }

        console.log("Creating Passwords Table...");
        await DB.schema.createTable(PASSWORD_TABLE, (table) => {
            table.increments("id").primary();

            table
                .integer("user_id")
                .notNullable()
                .references("id")
                .inTable(T.USER_TABLE)
                .onDelete("CASCADE");

            table.string("title").notNullable(); // e.g., "Google", "GitHub"
            table.string("website_url").nullable(); // e.g., "https://accounts.google.com"
            table.string("email_or_username").notNullable(); // email or login name
            table.text("password_encrypted").notNullable(); // securely encrypted password
            table.timestamp("created_at").defaultTo(DB.fn.now());
            table.timestamp("updated_at").defaultTo(DB.fn.now());
        });

        console.log("Created Passwords Table!");

        console.log("Creating Trigger for updated_at...");
        await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${PASSWORD_TABLE}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
        console.log("Trigger Added!");
    } catch (error) {
        console.error("Error creating passwords table:", error);
    }
};

// const run = async () => {
//     await seed(true);
// };
// run();
