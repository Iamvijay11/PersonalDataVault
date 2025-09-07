import knex from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve("D:/MyPortfolio/PersonalDataVault/Backend/.env"),
});

const DB = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: String(process.env.DB_PASSWORD),
        database: process.env.DB_DATABASE,
        port: 5432,
    },
    searchPath: [process.env.SCHEMA_NAME],
});

export default DB;

import { USERS_TABLE } from "./user.schema.js";
import { DOCUMENTS_TABLE } from "./document.schema.js";

export const T = { USERS_TABLE, DOCUMENTS_TABLE };

// Creates the procedure that is then added as a trigger to every table
// Only needs to be run once on each postgres schema
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
//   await createProcedure();
// };
// run();
