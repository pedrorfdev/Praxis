import { sql } from "drizzle-orm";
import { db } from "../db/connection";
import { schemas } from "../schemas/index";

async function main() {
  console.log("🌱 Iniciando o Seed...");

  console.log("🧹 Limpando dados antigos...");
  await db.execute(sql`TRUNCATE TABLE sessions, patients, clinics CASCADE`);

  
  console.log("🏥 Criando clínica...");
  const [mainClinic] = await db.insert(schemas.clinics).values({
    name: "Clínica Praxis - Demo",
    slug: "clinica-demo",
  }).returning();

  console.log("👤 Criando pacientes...");
  const [patient1, patient2] = await db.insert(schemas.patients).values([
    {
      clinicId: mainClinic.id,
      fullName: "João Silva",
      cpf: "12345678901",
      email: "joao@email.com",
    },
    {
      clinicId: mainClinic.id,
      fullName: "Maria Oliveira",
      cpf: "98765432100",
      email: "maria@email.com",
    }
  ]).returning();

  console.log("📅 Criando sessões...");
  await db.insert(schemas.sessions).values([
    {
      clinicId: mainClinic.id,
      patientId: patient1.id,
      scheduledAt: new Date(new Date().setHours(14, 0, 0, 0)),
      content: "Primeira consulta de avaliação.",
      status: "completed",
    },
    {
      clinicId: mainClinic.id,
      patientId: patient2.id,
      scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
      content: "Sessão de retorno quinzenal.",
      status: "scheduled",
    }
  ]);

  console.log("✅ Seed finalizado com sucesso!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro ao rodar o seed:", err);
  process.exit(1);
});