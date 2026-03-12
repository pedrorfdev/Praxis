import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infra/schemas/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: "postgresql://admin:password123@localhost:5432/praxis_db",
  },
});