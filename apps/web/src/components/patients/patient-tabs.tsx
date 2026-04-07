"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PatientTabs({ patientId }: { patientId: string }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Resumo", href: `/patients/${patientId}` },
    { name: "Anamnese", href: `/patients/${patientId}/anamnesis` },
    { name: "Linha do Tempo", href: `/patients/${patientId}/timeline` },
  ];

  return (
    <nav className="flex items-center gap-2 p-1 bg-card/30 border border-border/20 rounded-2xl w-fit">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
              isActive 
                ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20" 
                : "text-muted-foreground hover:text-primary hover:bg-secondary/5"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}