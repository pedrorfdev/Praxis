import * as bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { schemas } from '../schemas/index'

async function main() {
  console.log('🌱 Iniciando o Seed Profissional...')

  console.log('🧹 Limpando dados antigos (CASCADE)...')
  await db.execute(
    sql`TRUNCATE TABLE clinics, patients, caregivers, patient_caregivers, encounters CASCADE`,
  )

  console.log('🔐 Gerando hash de senha para conta Demo...')
  const hashedDemoPassword = await bcrypt.hash('praxis123', 10)

  console.log('🏥 Criando clínica Demo...')
  const [mainClinic] = await db
    .insert(schemas.clinics)
    .values({
      name: 'Clínica Praxis - Demo',
      slug: 'clinica-demo',
      email: 'demo@praxis.com.br',
      password: hashedDemoPassword,
    })
    .returning()

  console.log('👤 Criando pacientes com dados fictícios...')
  const [patient1, patient2] = await db
    .insert(schemas.patients)
    .values([
      {
        clinicId: mainClinic.id,
        type: 'ADULT',
        fullName: 'João Silva',
        birthDate: new Date('1990-06-12'),
        gender: 'Masculino',
        phone: '11999998888',
        diagnosis: 'TDAH',
        address: 'Rua A, 10',
        city: 'São Paulo',
        cpf: '12345678901',
        birthPlace: 'São Paulo - SP',
        maritalStatus: 'Solteiro',
        educationLevel: 'Superior completo',
        profession: 'Analista',
        religion: 'Nenhuma',
      },
      {
        clinicId: mainClinic.id,
        type: 'ADULT',
        fullName: 'Maria Oliveira',
        birthDate: new Date('1988-02-08'),
        gender: 'Feminino',
        phone: '11988887777',
        diagnosis: 'TEA',
        address: 'Rua B, 22',
        city: 'São Paulo',
        cpf: '98765432100',
        birthPlace: 'Campinas - SP',
        maritalStatus: 'Casada',
        educationLevel: 'Superior completo',
        profession: 'Professora',
        religion: 'Nenhuma',
      },
    ])
    .returning()

  console.log('👨‍👩‍👧 Criando cuidadores e vínculos...')
  const [caregiver1, caregiver2] = await db
    .insert(schemas.caregivers)
    .values([
      {
        clinicId: mainClinic.id,
        name: 'Carla Silva',
        document: '11122233344',
        phone: '11997776666',
        address: 'Rua A, 10',
      },
      {
        clinicId: mainClinic.id,
        name: 'José Oliveira',
        document: '55566677788',
        phone: '11994443322',
        address: 'Rua B, 22',
      },
    ])
    .returning()

  await db.insert(schemas.patientCaregivers).values([
    {
      clinicId: mainClinic.id,
      patientId: patient1.id,
      caregiverId: caregiver1.id,
      isPrimary: true,
    },
    {
      clinicId: mainClinic.id,
      patientId: patient2.id,
      caregiverId: caregiver2.id,
      isPrimary: true,
    },
  ])

  console.log('📅 Criando encontros (Histórico e Futuro)...')
  await db.insert(schemas.encounters).values([
    {
      clinicId: mainClinic.id,
      patientId: patient1.id,
      startAt: new Date(new Date().setHours(14, 0, 0, 0)),
      durationInMinutes: 50,
      billingType: 'PRIVATE',
      content:
        'Primeira consulta de avaliação: Paciente apresenta sintomas de ansiedade leve.',
      status: 'completed',
    },
    {
      clinicId: mainClinic.id,
      patientId: patient2.id,
      startAt: new Date(new Date().setDate(new Date().getDate() + 2)),
      durationInMinutes: 60,
      billingType: 'SUBSIDIZED',
      content:
        'Sessão de retorno quinzenal: Acompanhamento de progresso terapêutico.',
      status: 'in_progress',
    },
  ])

  console.log(`
✅ Seed finalizado com sucesso!
-------------------------------
🚀 Conta Demo Criada:
📧 E-mail: demo@praxis.com.br
🔑 Senha: praxis123
-------------------------------
  `)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro fatal ao rodar o seed:', err)
  process.exit(1)
})
