CREATE TYPE "public"."encounter_status" AS ENUM('in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."diagnosis" AS ENUM('TDAH', 'TEA', 'DEPRESSAO', 'ANSIEDADE', 'BIPOLAR', 'ESQUIZOFRENIA', 'TOC', 'PTSD', 'AUTISMO', 'SINDROME_DOWN', 'DEFICIENCIA_INTELECTUAL', 'PARALISIA_CEREBRAL', 'DISTURBIO_APRENDIZAGEM', 'GAGUEZ', 'AFASIA', 'DYSPRAXIA', 'OUTRO');--> statement-breakpoint
CREATE TYPE "public"."patient_type" AS ENUM('ADULT', 'CHILD');--> statement-breakpoint
CREATE TABLE "caregivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"name" text NOT NULL,
	"document" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"zip_code" text,
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "encounters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"start_at" timestamp DEFAULT now() NOT NULL,
	"duration_in_minutes" integer DEFAULT 60 NOT NULL,
	"billing_type" "billing_type" DEFAULT 'PRIVATE' NOT NULL,
	"content" text,
	"status" "encounter_status" DEFAULT 'in_progress' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_caregivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"caregiver_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "type" SET DATA TYPE "public"."patient_type" USING "type"::"public"."patient_type";--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "diagnosis" SET DATA TYPE "public"."diagnosis" USING "diagnosis"::"public"."diagnosis";--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "birth_place" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "marital_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "education_level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "profession" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "religion" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "caregivers" ADD CONSTRAINT "caregivers_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_caregivers" ADD CONSTRAINT "patient_caregivers_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_caregivers" ADD CONSTRAINT "patient_caregivers_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_caregivers" ADD CONSTRAINT "patient_caregivers_caregiver_id_caregivers_id_fk" FOREIGN KEY ("caregiver_id") REFERENCES "public"."caregivers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "clinic_caregiver_document_unique" ON "caregivers" USING btree ("clinic_id","document");--> statement-breakpoint
CREATE UNIQUE INDEX "patient_caregiver_unique" ON "patient_caregivers" USING btree ("patient_id","caregiver_id");--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_cpf_unique" UNIQUE("cpf");--> statement-breakpoint
DROP TYPE "public"."session_status";