import { api } from "@/lib/api";
import { frontendRuntimeConfig } from "@/lib/runtime-config";
import { 
  patientMocks, 
  caregiverMocks, 
  activityMocks, 
  encounterMocks 
} from "@/mocks/data";
import type { 
  PatientSummary, 
  CaregiverSummary, 
  ActivityItem, 
  EncounterItem 
} from "@/mocks/entities";

// Helper para simular delay em modo mock
const fallback = async <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 400));
};

const caregiverPatientLinksMock = new Map<string, Set<string>>([
  ["1", new Set(["1", "2"])],
  ["2", new Set(["3"])],
  ["3", new Set()],
]);

const getMockLinkedPatients = (caregiverId: string) => {
  const linkedPatientIds = caregiverPatientLinksMock.get(caregiverId) ?? new Set<string>();

  return Array.from(linkedPatientIds)
    .map((patientId) => patientMocks.find((p) => p.id === patientId))
    .filter((patient): patient is PatientSummary => Boolean(patient))
    .map((patient) => ({
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        diagnosis: patient.diagnosis,
        lastSession: patient.lastSession,
      },
    }));
};

/* ============================================================================
   MÓDULO DE PACIENTES
   ============================================================================ */

export async function listPatients(): Promise<PatientSummary[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(patientMocks);
  
  const response = await api.get("/patients");
  return response.data.map((p: any) => ({
    id: p.id,
    fullName: p.fullName,
    diagnosis: p.diagnosis || "Não informado",
    status: p.status === "paused" ? "Pausado" : "Ativo",
    lastSession: p.lastSession ? new Date(p.lastSession).toLocaleDateString('pt-BR') : "-",
  }));
}

export async function getPatientById(id: string) {
  if (frontendRuntimeConfig.useMocks) {
    return fallback(patientMocks.find(p => p.id === id) || patientMocks[0]);
  }
  const response = await api.get(`/patients/${id}`);
  return response.data;
}

export async function createPatient(data: any) {
  const response = await api.post("/patients", data);
  return response.data;
}

export async function updatePatient(id: string, data: any) {
  const response = await api.patch(`/patients/${id}`, data);
  return response.data;
}

export async function deletePatient(id: string) {
  if (frontendRuntimeConfig.useMocks) {
    return fallback({ success: true });
  }
  const response = await api.delete(`/patients/${id}`);
  return response.data;
}

export async function listCaregivers(): Promise<CaregiverSummary[]> {
  if (frontendRuntimeConfig.useMocks) {
    const caregivers = caregiverMocks.map((caregiver) => ({
      ...caregiver,
      patientCount: getMockLinkedPatients(caregiver.id).length,
    }));
    return fallback(caregivers);
  }
  
  const response = await api.get("/caregivers");
  return response.data.map((c: any) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    document: c.document,
    patientCount: c.patientLinks?.length || 0,
  }));
}

export async function getCaregiverById(id: string) {
  if (frontendRuntimeConfig.useMocks) {
    const caregiver = caregiverMocks.find((c) => c.id === id) || caregiverMocks[0];
    return fallback({
      ...caregiver,
      patientLinks: getMockLinkedPatients(caregiver.id),
    });
  }
  const response = await api.get(`/caregivers/${id}`);
  return response.data;
}

export async function createCaregiver(data: any) {
  const response = await api.post("/caregivers", data);
  return response.data;
}

export async function updateCaregiver(id: string, data: any) {
  const response = await api.patch(`/caregivers/${id}`, data);
  return response.data;
}

export async function deleteCaregiver(id: string) {
  if (frontendRuntimeConfig.useMocks) {
    return fallback({ success: true });
  }
  const response = await api.delete(`/caregivers/${id}`);
  return response.data;
}

export async function linkPatientToCaregiver(caregiverId: string, patientId: string) {
  if (frontendRuntimeConfig.useMocks) {
    const links = caregiverPatientLinksMock.get(caregiverId) ?? new Set<string>();
    links.add(patientId);
    caregiverPatientLinksMock.set(caregiverId, links);

    return fallback({ success: true });
  }

  const response = await api.post(`/caregivers/${caregiverId}/patients/${patientId}`, { isPrimary: true });
  return response.data;
}

/* ============================================================================
   MÓDULO DE ATENDIMENTOS (ENCOUNTERS / ACTIVITIES)
   ============================================================================ */

export async function listActivities(): Promise<ActivityItem[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(activityMocks);
  
  const response = await api.get("/encounters");
  return response.data.map((e: any) => ({
    id: e.id,
    patientName: e.patient?.fullName || "Paciente",
    type: "Atendimento",
    date: e.startAt,
    status: e.status === "completed" ? "Concluído" : "Em andamento",
  }));
}

export async function listEncounters(): Promise<EncounterItem[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(encounterMocks);
  
  const response = await api.get("/encounters");
  return response.data.map((e: any) => ({
    id: e.id,
    date: new Date(e.startAt).toLocaleDateString("pt-BR"),
    duration: `${e.durationInMinutes || 60}min`,
    content: e.content || "Sem evolução registrada.",
    status: e.status
  }));
}

export async function createEncounter(data: any) {
  const response = await api.post("/encounters", data);
  return response.data;
}

export async function updateEncounter(id: string, data: any) {
  const response = await api.patch(`/encounters/${id}`, data);
  return response.data;
}

export async function getPatientAnamnesis(patientId: string) {
  if (frontendRuntimeConfig.useMocks) return fallback({ content: {} });
  
  const response = await api.get(`/patients/${patientId}/anamnesis`);
  return response.data;
}

export async function upsertAnamnesis(patientId: string, content: any) {
  const response = await api.put(`/patients/${patientId}/anamnesis`, { content });
  return response.data;
}
