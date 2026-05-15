import { defineConfig } from 'drizzle-kit'

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://admin:password123@localhost:5432/praxis_db'

export default defineConfig({
  schema: './src/infra/schemas/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: databaseUrl,
  },
})
