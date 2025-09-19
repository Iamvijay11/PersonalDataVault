import knex from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(
        "/home/vijay-kumar/Documents/MyPortfolio/PersonalDataVault/.env"
    ),
});

const DB = knex({
    client: "pg",
    connection: {
        connectionString: String(process.env.DATABASE_URL),
        ssl: { rejectUnauthorized: false },
    },
    searchPath: ["public"],
});

export default DB;

import { USERS_TABLE } from "./user.schema.js";
import { DOCUMENTS_TABLE } from "./document.schema.js";
import { PASSWORD_TABLE } from "./password.schema.js";

export const T = { USERS_TABLE, DOCUMENTS_TABLE, PASSWORD_TABLE };

export const createProcedure = async () => {
    await DB.raw(`
      CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
      LANGUAGE plpgsql
      AS
      $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$;
    `);
};

// const run = async () => {
//     await createProcedure();
// };
// run();
