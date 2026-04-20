"use client";

import {
  ArrowLeft,
  Users,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LinkPatientDialog } from "@/components/caregivers/link-patient-dialog";
import { CaregiverSidebar } from "@/components/caregivers/caregiver-sidebar";
import { use } from "react";

export default function CaregiverDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams as { id: string };
  const router = useRouter();

  const caregiver = {
    name: "Mariana Silva",
    kinship: "Mãe",
    phone: "(11) 98888-7777",
    email: "mariana@email.com",
    address: "Rua das Oliveiras, 450 - SP",
    patients: [
      {
        id: "p1",
        name: "João Silva",
        diagnosis: "TEA",
        lastSession: "20/03/2026",
      },
      {
        id: "p2",
        name: "Ana Silva",
        diagnosis: "TDAH",
        lastSession: "22/03/2026",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button
          onClick={() => router.push(`/caregivers/${id}/edit`)}
          className="gap-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20"
        >
          <Pencil className="h-4 w-4" /> Editar Perfil
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <CaregiverSidebar
          name={caregiver.name}
          phone={caregiver.phone}
          email={caregiver.email}
          address={caregiver.address}
        />

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
            <h3 className="text-2xl md:text-3xl font-black text-primary flex items-center gap-3">
              <Users className="h-6 w-6 text-secondary" /> Pacientes Vinculados
            </h3>
            <LinkPatientDialog />
          </div>

          <div className="grid gap-4">
            {caregiver.patients.map((p) => (
              <Card
                key={p.id}
                onClick={() => router.push(`/patients/${p.id}`)}
                className="group cursor-pointer bg-card border border-border rounded-xl p-5 hover:border-secondary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center font-bold text-primary text-xs">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-secondary transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {p.diagnosis}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Último Atendimento
                  </p>
                  <p className="text-xs font-medium">{p.lastSession}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
