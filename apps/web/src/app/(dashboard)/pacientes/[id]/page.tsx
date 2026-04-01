"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Clock, Calendar as CalendarIcon, MoreVertical, 
  ChevronDown, ChevronUp, FileText, Phone, 
  User, CreditCard, GraduationCap, Briefcase, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockSessions = [
  {
    id: "1",
    date: "21 Março, 2026",
    duration: "50min",
    content: "Paciente apresentou boa regulação sensorial hoje. Trabalhamos atividades de motricidade fina com foco em pinça. Demonstrou resistência inicial, mas finalizou a tarefa com suporte verbal."
  }
];

export default function PatientDetailsPage() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const patientId = "1"; // Mock do ID atual

  const handleNewSession = () => {
    router.push(`/atendimentos/novo?patientId=${patientId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <aside className="md:col-span-4 lg:col-span-3">
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
      </aside>

      <main className="md:col-span-8 lg:col-span-9 space-y-6">
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
            Nova Sessão
          </Button>
        </div>

        {mockSessions.length > 0 ? (
          <div className="relative pl-8 border-l-2 border-secondary/20 space-y-8 ml-4">
            {mockSessions.map((session) => (
              <div key={session.id} className="relative group animate-in slide-in-from-left-4 duration-500">
                <div className="absolute -left-[41px] top-8 h-4 w-4 rounded-full bg-secondary border-4 border-background group-hover:scale-125 transition-transform shadow-sm" />
                
                <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm hover:border-secondary/40 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                        {session.date}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold italic uppercase tracking-tighter">
                        Duração: {session.duration}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-secondary/10 hover:text-secondary">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-base text-foreground/80 leading-relaxed font-medium">
                    {session.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Professional Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-secondary/20">
            <div className="h-20 w-20 bg-background rounded-3xl flex items-center justify-center shadow-xl mb-6 rotate-3">
              <FileText className="h-10 w-10 text-secondary/40" />
            </div>
            <h4 className="text-xl font-bold text-primary">Nenhuma sessão registrada</h4>
            <p className="text-sm text-muted-foreground max-w-[320px] text-center mt-2 mb-8 font-medium">
              O prontuário deste paciente está vazio. Inicie a primeira evolução clínica agora.
            </p>
            <Button 
              onClick={handleNewSession}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-10 h-12 font-bold shadow-lg"
            >
              Iniciar Atendimento
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}