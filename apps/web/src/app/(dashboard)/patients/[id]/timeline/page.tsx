import { TimelineHeader } from "@/components/patients/timeline-header";
import { TimelineFilters } from "@/components/patients/timeline-filters";
import { EncounterTimelineList } from "@/components/patients/encounter-timeline-list";

export default function PatientTimelinePage() {
  return (
    <div className="space-y-8 mx-auto">
      <TimelineHeader />

      <TimelineFilters />

      <EncounterTimelineList />
    </div>
  );
}