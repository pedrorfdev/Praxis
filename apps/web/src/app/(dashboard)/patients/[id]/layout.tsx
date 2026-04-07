"use client";

import { usePathname } from "next/navigation";
import { AnamnesisStepper } from "./anamnesis/_components/anamnesis-stepper";
import { use } from "react";
import { PatientSidebar } from "@/components/patients/patient-sidebar";
import { PatientTabs } from "@/components/patients/patient-tabs";
import { AnamnesisProvider } from "./anamnesis/_components/anamnesis-provider";


interface PatientLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function PatientLayout({ children, params }: PatientLayoutProps) {
  const { id } = use(params); 
  
  const pathname = usePathname();
  const isAnamnesis = pathname.includes("/anamnesis");

  const sidebarContent = isAnamnesis ? (
    <div className="sticky top-8 space-y-4">
      <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progresso</h3>
      <AnamnesisStepper />
    </div>
  ) : (
    <PatientSidebar patientId={id} />
  );

 return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {isAnamnesis ? (
        <AnamnesisProvider patientId={id}>
          <aside className="md:col-span-4 lg:col-span-3">{sidebarContent}</aside>
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            <PatientTabs patientId={id} />
            {children}
          </main>
        </AnamnesisProvider>
      ) : (
        <>
          <aside className="md:col-span-4 lg:col-span-3">{sidebarContent}</aside>
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            <PatientTabs patientId={id} />
            {children}
          </main>
        </>
      )}
    </div>
  );
}