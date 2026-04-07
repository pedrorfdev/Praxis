"use client";

import { useFormContext } from "react-hook-form";
import { PatientMiniHeader } from "./_components/patient-mini-header";

export default function AnamnesisPage() {
  const { handleSubmit } = useFormContext();

  const onSubmit = (data: any) => {
    console.log("Dados prontos para o Banco:", data);
  };

  return (
    <>
      <PatientMiniHeader />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-12 pb-20"
      >
        <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-[2rem] mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Anamnese Clínica
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Preencha os marcos do desenvolvimento do paciente. Os dados são
            salvos automaticamente no seu navegador.
          </p>
        </div>

        <div className="text-center py-24 border-2 border-dashed border-border/30 rounded-[3rem] bg-card/20">
          <p className="text-muted-foreground font-medium italic">
            Selecione um tópico ao lado para iniciar o preenchimento.
          </p>
        </div>
      </form>
    </>
  );
}