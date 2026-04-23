import { Users, FileCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    title: "Pacientes Ativos",
    value: "42",
    icon: Users,
    color: "text-primary",
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Atendimentos",
    value: "18",
    icon: Activity,
    color: "text-secondary",
    className: "md:col-span-2 lg:col-span-3",
  },
  {
    title: "Evoluções Finalizadas",
    value: "156",
    icon: FileCheck,
    color: "text-secondary",
    className: "md:col-span-2 lg:col-span-2",
  },
];

export function MetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className={cn(
            "relative overflow-hidden rounded-xl border border-border/40 bg-card/50 p-6 transition-all hover:border-secondary/30",
            metric.className
          )}
        >
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {metric.title}
            </p>
            <metric.icon className={cn("h-5 w-5", metric.color)} />
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black tracking-tighter text-primary">
              {metric.value}
            </h2>
          </div>          
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-secondary/5 blur-3xl" />
        </div>
      ))}
    </div>
  );
}