import { clinics } from './clinics'
import { caregivers, caregiversRelations } from './caregivers'
import { encounters, encounterStatusEnum, encountersRelations } from './encounters'
import { patientCaregivers, patientCaregiversRelations } from './patient-caregivers'
import { patients, patientsRelations } from './patients'
import { passwordResetTokens } from './auth'
import { anamnesis } from './anamnesis'

export const schemas = {
  clinics,
  caregivers,
  caregiversRelations,
  encounters,
  encounterStatusEnum,
  encountersRelations,
  patientCaregivers,
  patientCaregiversRelations,
  patients,
  patientsRelations,
  passwordResetTokens,
  anamnesis,
}
