import { Goal } from "@/components/goals";
import { MetricsGrid } from "@/components/metrics-grid";
import { SpecialtyChart } from "@/components/specialty-chart";
import { UpcomingSessions } from "@/components/upcoming-sessions";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-muted-foreground font-medium italic text-sm">
            "A terapia é o caminho para a autonomia."
          </p>
        </div>
        
        <Link href="/atendimentos/novo">
          <Button className="bg-secondary text-secondary-foreground gap-2 h-12 px-6 rounded-xl font-bold shadow-xl shadow-secondary/20 hover:scale-[1.02] transition-all">
            <PlusCircle className="h-5 w-5" />
            Nova Sessão
          </Button>
        </Link>
      </header>

      <MetricsGrid />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <SpecialtyChart />
          <Goal />
        </div>
      </div>
    </div>
  )
}