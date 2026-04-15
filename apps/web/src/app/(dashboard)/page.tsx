import { MetricsGrid } from "@/components/metrics-grid";
import { SpecialtyChart } from "@/components/specialty-chart";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-muted-foreground font-medium italic text-sm">
            Bem-vindo de volta ao seu centro de comando.
          </p>
        </div>
        
        <Link href="/encounters/new">
          <Button className="bg-secondary text-secondary-foreground gap-2 h-12 px-6 rounded-2xl font-bold">
            <PlusCircle className="h-5 w-5" />
            Nova Sessão
          </Button>
        </Link>
      </header>

      <MetricsGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card/30 border border-border/40 rounded-[2.5rem] p-6">
          <h3 className="text-lg font-bold text-primary mb-4">Distribuição por Especialidade</h3>
          <SpecialtyChart />
        </div>

        <div className="bg-card/30 border border-border/40 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center space-y-4">
           <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-primary" />
           </div>
           <h3 className="text-xl font-bold">Pronta para crescer?</h3>
           <p className="text-zinc-500 text-sm max-w-[280px]">
             Você já realizou 18 atendimentos. Mantenha o foco na evolução dos seus pacientes.
           </p>
           <Link href="/activity" className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline">
              Ver histórico completo
           </Link>
        </div>
      </div>
    </div>
  );
}