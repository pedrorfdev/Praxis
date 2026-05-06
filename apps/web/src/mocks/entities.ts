export type PatientStatus = "Ativo" | "Pausado";

export interface PatientSummary {
  id: string;
  fullName: string;
  diagnosis: string;
  status: PatientStatus;
  lastSession: string;
}

export interface CaregiverSummary {
  id: string;
  name: string;
  document: string;
  address: string;
  phone: string;
  status: PatientStatus;
  patientCount: number;
}

export interface ActivityItem {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
}

export interface EncounterItem {
  id: string;
  date: string;
  duration: string;
  content: string;
}
