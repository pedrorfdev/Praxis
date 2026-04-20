import { api } from "@/lib/api";
import { frontendRuntimeConfig } from "@/lib/runtime-config";
import {
  activityMocks,
  caregiverMocks,
  encounterMocks,
  patientMocks,
} from "@/mocks/data";
import type {
  ActivityItem,
  CaregiverSummary,
  EncounterItem,
  PatientSummary,
} from "@/mocks/entities";
import type { CreatePatientInput, UpdatePatientInput } from "@praxis/core/domain";

const fallback = <T>(value: T) => Promise.resolve(value);

export async function listPatients(): Promise<PatientSummary[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(patientMocks);
  const response = await api.get("/patients");
  return response.data.map((patient: any) => ({
    id: patient.id,
    fullName: patient.fullName,
    diagnosis: patient.diagnosis ?? "Não informado",
    status: patient.status === "paused" ? "Pausado" : "Ativo",
    lastSession: patient.lastSession ?? "-",
  }));
}

export async function getPatientById(patientId: string) {
  if (frontendRuntimeConfig.useMocks) {
    const patient = patientMocks.find((item) => item.id === patientId);
    if (!patient) throw new Error("Paciente não encontrado");
    return {
      id: patient.id,
      fullName: patient.fullName,
      type: "ADULT",
      birthDate: new Date().toISOString(),
      gender: "Não informado",
      cpf: "00000000000",
      address: "Não informado",
      city: "Não informado",
      birthPlace: "Não informado",
      maritalStatus: "Não informado",
      educationLevel: "Não informado",
      profession: "Não informado",
      religion: "Não informado",
      phone: null,
      responsibleName: null,
      responsiblePhone: null,
      diagnosis: patient.diagnosis,
    };
  }
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
}

export async function createPatient(payload: CreatePatientInput) {
  if (frontendRuntimeConfig.useMocks) return fallback({ id: crypto.randomUUID(), ...payload });
  return api.post("/patients", payload);
}

export async function updatePatient(patientId: string, payload: UpdatePatientInput) {
  if (frontendRuntimeConfig.useMocks) return fallback({ id: patientId, ...payload });
  return api.patch(`/patients/${patientId}`, payload);
}

export async function listCaregivers(): Promise<CaregiverSummary[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(caregiverMocks);
  return fallback(caregiverMocks);
}

export async function listActivities(): Promise<ActivityItem[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(activityMocks);
  return fallback(activityMocks);
}

export async function listEncounters(): Promise<EncounterItem[]> {
  if (frontendRuntimeConfig.useMocks) return fallback(encounterMocks);
  const response = await api.get("/encounters");
  return response.data.map((encounter: any) => ({
    id: encounter.id,
    date: new Date(encounter.startAt).toLocaleDateString("pt-BR"),
    duration: `${encounter.durationInMinutes ?? 60}min`,
    content: encounter.content ?? "Sem evolução registrada.",
  }));
}
