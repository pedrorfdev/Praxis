import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { schemas } from "./schemas";

const connectionString = "postgresql://admin:password123@localhost:5432/praxis_db";

export const sql = postgres(connectionString);

export const db = drizzle(sql, { 
  schema: schemas, 
  casing: "snake_case" 
});

export { schemas as schema };