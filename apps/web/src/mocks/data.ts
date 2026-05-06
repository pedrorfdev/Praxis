import type {
  ActivityItem,
  CaregiverSummary,
  EncounterItem,
  PatientSummary,
} from "@/mocks/entities";

export const patientMocks: PatientSummary[] = [
  {
    id: "1",
    fullName: "João Silva",
    diagnosis: "TEA",
    status: "Ativo",
    lastSession: "20/03/2026",
  },
  {
    id: "2",
    fullName: "Maria Oliveira",
    diagnosis: "TDAH",
    status: "Ativo",
    lastSession: "21/03/2026",
  },
  {
    id: "3",
    fullName: "Pedro Santos",
    diagnosis: "Coordenação Motora",
    status: "Pausado",
    lastSession: "15/02/2026",
  },
];

export const caregiverMocks: CaregiverSummary[] = [
  {
    id: "1",
    name: "Mariana Silva",
    document: "123.456.789-00",
    address: "Rua das Flores, 123",
    phone: "(11) 98888-7777",
    status: "Ativo",
    patientCount: 2,
  },
  {
    id: "2",
    name: "Roberto Santos",
    document: "987.654.321-11",
    address: "Rua das Flores, 23",
    phone: "(21) 95555-4444",
    status: "Pausado",
    patientCount: 1,
  },
  {
    id: "3",
    name: "Ana Oliveira",
    document: "111.222.333-44",
    address: "Rua das Flores, 13",
    phone: "(31) 97777-6666",
    status: "Ativo",
    patientCount: 0,
  },
];

export const activityMocks: ActivityItem[] = [
  { id: "1", patientId: "1", patientName: "Ana Clara Silva", date: "2026-04-13T14:30:00" },
  { id: "2", patientId: "2", patientName: "João Pedro Santos", date: "2026-04-13T10:00:00" },
  { id: "3", patientId: "3", patientName: "Beatriz Oliveira", date: "2026-04-12T16:00:00" },
  { id: "4", patientId: "1", patientName: "Ricardo Menezes", date: "2026-04-11T09:00:00" },
];

export const encounterMocks: EncounterItem[] = [
  {
    id: "1",
    date: "21 Março, 2026",
    duration: "50min",
    content:
      "Paciente apresentou boa regulação sensorial hoje. Trabalhamos atividades de motricidade fina com foco em pinça.",
  },
  {
    id: "2",
    date: "14 Março, 2026",
    duration: "45min",
    content:
      "Sessão focada em interação social. João manteve contato visual por períodos mais longos durante a atividade lúdica.",
  },
  {
    id: "3",
    date: "07 Março, 2026",
    duration: "60min",
    content:
      "Análise comportamental em ambiente controlado. Respondeu bem aos estímulos visuais e sonoros.",
  },
];
