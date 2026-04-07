"use client";

import { MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockEncounters = [
  {
    id: "1",
    date: "21 Março, 2026",
    duration: "50min",
    content: "Paciente apresentou boa regulação sensorial hoje. Trabalhamos atividades de motricidade fina com foco em pinça. Demonstrou resistência inicial, mas finalizou a tarefa com suporte verbal."
  }
];

export function EncounterList() {
  if (mockEncounters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-secondary/20">
        <div className="h-20 w-20 bg-background rounded-3xl flex items-center justify-center shadow-xl mb-6 rotate-3">
          <FileText className="h-10 w-10 text-secondary/40" />
        </div>
        <h4 className="text-xl font-bold text-primary">Nenhuma sessão registrada</h4>
        <p className="text-sm text-muted-foreground max-w-[320px] text-center mt-2 mb-8 font-medium">
          O prontuário deste paciente está vazio. Inicie a primeira evolução clínica agora.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 border-l-2 border-secondary/20 space-y-8 ml-4">
      {mockEncounters.map((encounter) => (
        <div key={encounter.id} className="relative group animate-in slide-in-from-left-4 duration-500">
          <div className="absolute -left-[41px] top-8 h-4 w-4 rounded-full bg-secondary border-4 border-background group-hover:scale-125 transition-transform shadow-sm" />
          
          <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm hover:border-secondary/40 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                  {encounter.date}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold italic uppercase tracking-tighter">
                  Duração: {encounter.duration}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary/10 hover:text-secondary">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-base text-foreground/80 leading-relaxed font-medium">
              {encounter.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}