import * as bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { schemas } from '../schemas/index'
import { fakerPT_BR as faker } from '@faker-js/faker'

// Lista extraída EXATAMENTE do seu diagnosisEnum no schema
const DIAGNOSES = [
  'TDAH', 'TEA', 'DEPRESSAO', 'ANSIEDADE', 'BIPOLAR', 'ESQUIZOFRENIA', 'TOC',
  'PTSD', 'AUTISMO', 'SINDROME_DOWN', 'DEFICIENCIA_INTELECTUAL', 'PARALISIA_CEREBRAL',
  'DISTURBIO_APRENDIZAGEM', 'GAGUEZ', 'AFASIA', 'DYSPRAXIA', 'OUTRO'
] as const

async function main() {
  console.log('🌱 Iniciando o Seed Profissional com Faker...')

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
      email: 'pedrorf2006@gmail.com',
      password: hashedDemoPassword,
    })
    .returning()

  console.log('👤 Gerando pacientes dinâmicos...')
  const patientsData = Array.from({ length: 25 }).map((_, index) => {
    const isAdult = faker.datatype.boolean()
    const type = (isAdult ? 'ADULT' : 'CHILD') as 'ADULT' | 'CHILD'

    return {
      clinicId: mainClinic.id,
      type,
      fullName: faker.person.fullName(),
      birthDate: faker.date.birthdate({
        mode: 'age',
        min: isAdult ? 18 : 3,
        max: isAdult ? 80 : 17,
      }),
      gender: faker.helpers.arrayElement(['Masculino', 'Feminino', 'Outro']),
      phone: faker.string.numeric(11),

      diagnosis: index < 3 ? undefined : faker.helpers.arrayElement(DIAGNOSES),

      address: `${faker.location.street()}, ${faker.number.int({ min: 1, max: 2000 })}`,
      city: faker.location.city(),
      cpf: faker.string.numeric(11),
      birthPlace: `${faker.location.city()} - ${faker.location.state({ abbreviated: true })}`,

      maritalStatus: isAdult ? faker.helpers.arrayElement(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)']) : 'Não se aplica',
      educationLevel: isAdult ? 'Ensino Superior Completo' : 'Ensino Fundamental',
      profession: isAdult ? faker.person.jobTitle() : 'Estudante',
      religion: faker.helpers.arrayElement(['Católica', 'Evangélica', 'Espírita', 'Nenhuma']),

      responsibleName: !isAdult ? faker.person.fullName() : undefined,
      responsiblePhone: !isAdult ? faker.string.numeric(11) : undefined,
    }
  })

  const patients = await db
    .insert(schemas.patients)
    .values(patientsData)
    .returning()

  console.log('👨‍👩‍👧 Gerando cuidadores...')
  const caregiversData = Array.from({ length: 10 }).map(() => ({
    clinicId: mainClinic.id,
    name: faker.person.fullName(),
    document: faker.string.numeric(11),
    phone: faker.string.numeric(11),
    address: `${faker.location.street()}, ${faker.number.int({ min: 1, max: 1000 })}`,
    email: faker.internet.email().toLowerCase(),
    zipCode: faker.string.numeric(8),
  }))

  const caregivers = await db
    .insert(schemas.caregivers)
    .values(caregiversData)
    .returning()

  console.log('🔗 Criando vínculos (Patient <-> Caregiver)...')
  const patientCaregiverLinks = patients
    .filter(p => p.type === 'CHILD')
    .map((patient) => ({
      clinicId: mainClinic.id,
      patientId: patient.id,
      caregiverId: faker.helpers.arrayElement(caregivers).id,
      isPrimary: true,
    }))

  if (patientCaregiverLinks.length > 0) {
    await db.insert(schemas.patientCaregivers).values(patientCaregiverLinks)
  }

  console.log('📅 Gerando evoluções e prontuários (Encounters)...')
  const encountersData = Array.from({ length: 50 }).map(() => {
    const isCompleted = faker.datatype.boolean({ probability: 0.8 })

    return {
      clinicId: mainClinic.id,
      patientId: faker.helpers.arrayElement(patients).id,
      startAt: faker.date.recent({ days: 30 }),
      durationInMinutes: faker.helpers.arrayElement([30, 45, 50, 60]),
      billingType: faker.helpers.arrayElement(['PRIVATE', 'SUBSIDIZED'] as const),
      content: isCompleted ? `<p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p>` : '',
      status: (isCompleted ? 'completed' : 'in_progress') as 'completed' | 'in_progress',
    }
  })

  await db.insert(schemas.encounters).values(encountersData)

  console.log(`
✅ Seed dinâmico finalizado com sucesso!
-------------------------------
🚀 Conta Demo Criada:
📧 E-mail: pedrorf2006@gmail.com
🔑 Senha: praxis123
📊 Pacientes gerados: ${patients.length}
👥 Cuidadores gerados: ${caregivers.length}
📝 Consultas geradas: ${encountersData.length}
-------------------------------
  `)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Erro fatal ao rodar o seed:', err)
  process.exit(1)
})