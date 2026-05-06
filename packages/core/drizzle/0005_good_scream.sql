ALTER TABLE "anamnesis" DROP CONSTRAINT "anamnesis_patientId_unique";--> statement-breakpoint
ALTER TABLE "patients" DROP CONSTRAINT "patients_cpf_unique";--> statement-breakpoint
DROP INDEX "patient_caregiver_unique";--> statement-breakpoint
ALTER TABLE "caregivers" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "encounters" ADD COLUMN "session_value_in_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "patient_caregiver_unique" ON "patient_caregivers" USING btree ("clinic_id","patient_id","caregiver_id");--> statement-breakpoint
ALTER TABLE "anamnesis" ADD CONSTRAINT "anamnesis_clinicId_patientId_unique" UNIQUE("clinic_id","patient_id");