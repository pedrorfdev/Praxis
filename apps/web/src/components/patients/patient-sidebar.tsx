"use client";

import { useState } from "react";
import { User, Phone, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PatientSidebarProps {
  patientId: string;
}

export function PatientSidebar({ patientId }: PatientSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm sticky top-8 transition-all">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary border-2 border-secondary/20 shadow-inner">
          JS
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">João Silva</h2>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black bg-secondary/5 border border-secondary/10 px-3 py-1 rounded-full">
            Diagnóstico: TEA
          </span>
        </div>
      </div>

      <hr className="my-6 border-border/40" />

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Responsável</span>
            <span className="text-sm font-bold">Maria Silva (Mãe)</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Contato</span>
            <span className="text-sm font-bold">(51) 99887-6655</span>
          </div>
        </div>

        <div className={cn(
          "grid transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        )}>
          <div className="min-h-0 space-y-4 border-t border-border/20 pt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1.5 bg-secondary/5 rounded-lg text-secondary font-mono text-[10px]">CPF</div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">123.456.789-00</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 text-secondary mt-1" />
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-black">Escolaridade</span>
                <span className="text-sm font-bold">Ensino Fundamental I</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button 
        variant="ghost" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-6 h-9 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
      >
        {isExpanded ? (
          <>Recolher Ficha <ChevronUp className="ml-2 h-3.5 w-3.5" /></>
        ) : (
          <>Ver Ficha Completa <ChevronDown className="ml-2 h-3.5 w-3.5" /></>
        )}
      </Button>
    </div>
  );
}