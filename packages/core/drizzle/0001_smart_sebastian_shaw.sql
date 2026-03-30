ALTER TABLE "patients" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "birth_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "diagnosis" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "responsible_name" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "responsible_phone" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "birth_place" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "marital_status" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "education_level" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "profession" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "religion" text;--> statement-breakpoint
ALTER TABLE "patients" DROP COLUMN "email";