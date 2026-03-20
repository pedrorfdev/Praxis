"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../db/connection");
const index_1 = require("../schemas/index");
const bcrypt = require("bcryptjs");
async function main() {
    console.log("🌱 Iniciando o Seed Profissional...");
    console.log("🧹 Limpando dados antigos (CASCADE)...");
    await connection_1.db.execute((0, drizzle_orm_1.sql) `TRUNCATE TABLE clinics, patients, sessions CASCADE`);
    console.log("🔐 Gerando hash de senha para conta Demo...");
    const hashedDemoPassword = await bcrypt.hash("praxis123", 10);
    console.log("🏥 Criando clínica Demo...");
    const [mainClinic] = await connection_1.db.insert(index_1.schemas.clinics).values({
        name: "Clínica Praxis - Demo",
        slug: "clinica-demo",
        email: "demo@praxis.com.br",
        password: hashedDemoPassword,
    }).returning();
    console.log("👤 Criando pacientes com dados fictícios...");
    const [patient1, patient2] = await connection_1.db.insert(index_1.schemas.patients).values([
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
    console.log("📅 Criando sessões (Histórico e Futuro)...");
    await connection_1.db.insert(index_1.schemas.sessions).values([
        {
            clinicId: mainClinic.id,
            patientId: patient1.id,
            scheduledAt: new Date(new Date().setHours(14, 0, 0, 0)),
            content: "Primeira consulta de avaliação: Paciente apresenta sintomas de ansiedade leve.",
            status: "completed",
        },
        {
            clinicId: mainClinic.id,
            patientId: patient2.id,
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
            content: "Sessão de retorno quinzenal: Acompanhamento de progresso terapêutico.",
            status: "scheduled",
        }
    ]);
    console.log(`
✅ Seed finalizado com sucesso!
-------------------------------
🚀 Conta Demo Criada:
📧 E-mail: demo@praxis.com.br
🔑 Senha: praxis123
-------------------------------
  `);
    process.exit(0);
}
main().catch((err) => {
    console.error("❌ Erro fatal ao rodar o seed:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map