import { TimelineHeader } from "@/components/patients/timeline-header";
import { EncounterList } from "@/components/patients/encounter-list";

export default function PatientOverviewPage() {
  return (
    <div className="space-y-6">
      <TimelineHeader />
      
      <EncounterList />
    </div>
  );
}