import { useState } from "react";
import { User, Phone, Briefcase, ChevronDown, ChevronUp, MapPin, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/services/frontend-data";
import { Loader2 } from "lucide-react";

interface PatientSidebarProps {
  patientId: string;
}

export function PatientSidebar({ patientId }: PatientSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => getPatientById(patientId),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border border-border/40 bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-secondary" />
      </div>
    );
  }

  const initials = patient?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm sticky top-8 transition-all">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary border-2 border-secondary/20 shadow-inner uppercase">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">{patient?.fullName}</h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-black bg-secondary/5 border border-secondary/10 px-3 py-1 rounded-full">
            {patient?.diagnosis ? `Diagnóstico: ${patient.diagnosis}` : "Sem diagnóstico"}
          </span>
        </div>
      </div>

      <hr className="my-6 border-border/40" />

      <div className="space-y-4">
        {/* SEMPRE VISÍVEL (MODO COLLAPSED) */}
        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Contato</span>
            <span className="text-sm font-bold">{patient?.phone || "Não informado"}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">CPF</span>
            <span className="text-sm font-bold">{patient?.cpf || "Não informado"}</span>
          </div>
        </div>

        {/* EXPANSÍVEL (DEMAIS DADOS) */}
        <div className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="min-h-0 space-y-4 border-t border-border/20 pt-4">
             <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Responsável</span>
                <span className="text-sm font-bold">{patient?.responsibleName || "Não informado"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Profissão</span>
                <span className="text-sm font-bold">{patient?.profession || "Não informado"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Escolaridade</span>
                <span className="text-sm font-bold">{patient?.educationLevel || "Não informado"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
                <Heart className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Religião</span>
                <span className="text-sm font-bold">{patient?.religion || "Não informado"}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Endereço</span>
                <span className="text-sm font-bold line-clamp-2">{patient?.address}, {patient?.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button 
        variant="ghost" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-6 h-9 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all"
      >
        {isExpanded ? (
          <>Recolher Ficha <ChevronUp className="ml-2 h-3 w-3" /></>
        ) : (
          <>Ver Ficha Completa <ChevronDown className="ml-2 h-3 w-3" /></>
        )}
      </Button>
    </div>
  );
}