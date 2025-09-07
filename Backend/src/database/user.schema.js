import DB from "./index.schema.js";

export const USERS_TABLE = "users";

export const seed = async (dropFirst = true) => {
    try {
        if (dropFirst) {
            console.log("Dropping Users Table...");
            await DB.schema.dropTableIfExists(USERS_TABLE);
            console.log("Dropped Users Table!");
        }

        console.log("Creating Users Table...");
        await DB.schema.createTable(USERS_TABLE, (table) => {
            table.increments("id").primary();
            table.string("first_name").notNullable();
            table.string("last_name").nullable();
            table.string("username").unique();
            table.string("email").notNullable().unique();
            table.string("password_hash").nullable();
            table.string("phone").nullable();
            table.string("profile_image_url").nullable();
            table.timestamp("created_at").defaultTo(DB.fn.now());
            table.timestamp("updated_at").defaultTo(DB.fn.now());
        });

        console.log("Created Users Table!");

        console.log("Creating Trigger for updated_at...");
        await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE
          ON ${USERS_TABLE}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
        console.log("Trigger Added!");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
};

// const run = async () => {
//     await seed(true);
// };
// run();
