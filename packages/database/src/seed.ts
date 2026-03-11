import { reset, seed } from "drizzle-seed";
import { db, sql, schema } from "./connection";

async function main() {
  console.log("🌱 Iniciando Drizzle Seed...");

  try {
    
    await reset(db, schema);

    await seed(db, schema).refine((f) => ({
      clinics: {
        count: 5,
        columns: {
          name: f.companyName(),
          slug: f.loremIpsum({ separator: "-", wordCount: 2 }),
        },
      },
    }));

    console.log("✅ Banco de dados populado!");
  } catch (error) {
    console.error("❌ Erro no seed:", error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

main();