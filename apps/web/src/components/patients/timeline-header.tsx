"use client";

import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TimelineHeader() {
  const router = useRouter();
  const patientId = "1";

  const handleNewSession = () => {
    router.push(`/encounters/new?patientId=${patientId}`);
  };

  return (
    <div className="flex items-center justify-between bg-card/30 p-4 rounded-2xl border border-border/20">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-secondary/10 rounded-xl">
          <Clock className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">Histórico de Evoluções</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Prontuário Digital</p>
        </div>
      </div>
      <Button 
        onClick={handleNewSession}
        className="bg-secondary text-secondary-foreground px-6 h-11 rounded-xl text-sm font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova evolução
      </Button>
    </div>
  );
}