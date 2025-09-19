import DB, { T } from "./index.schema.js";

export const DOCUMENTS_TABLE = "public.documents";

export const seed = async (dropFirst = false) => {
    try {
        if (dropFirst) {
            console.log("Dropping Documents Table...");
            await DB.schema.dropTableIfExists(DOCUMENTS_TABLE);
            console.log("Dropped Documents Table!");
        }

        console.log("Creating Documents Table...");
        await DB.schema.createTable(DOCUMENTS_TABLE, (table) => {
            table.increments("id").primary();
            table
                .integer("user_id")
                .notNullable()
                .references("id")
                .inTable(T.USERS_TABLE)
                .onDelete("CASCADE");
            table.string("filename").notNullable();
            table.string("file_type").notNullable();
            table.string("file_url").notNullable();
            table.string("category").notNullable();
            table.timestamp("created_at").defaultTo(DB.fn.now());
            table.timestamp("updated_at").defaultTo(DB.fn.now());
        });

        await DB.raw(`
          CREATE TRIGGER update_timestamp
          BEFORE UPDATE ON ${DOCUMENTS_TABLE}
          FOR EACH ROW
          EXECUTE PROCEDURE update_timestamp();
        `);
        console.log("Documents Table Created with Trigger!");
    } catch (error) {
        console.error("Error in Documents Table:", error);
    }
};

// const run = async () => {
//     await seed(true);
// };
// run();
