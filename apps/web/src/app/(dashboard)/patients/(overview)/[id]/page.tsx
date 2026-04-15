import { TimelineHeader } from "@/components/patients/timeline-header";
import { EncounterTimelineList } from "@/components/patients/encounter-timeline-list";

export default function PatientOverviewPage() {
  return (
    <div className="space-y-6">
      <TimelineHeader />
      
      <EncounterTimelineList limit={3} />
    </div>
  );  
}