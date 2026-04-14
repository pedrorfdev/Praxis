"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { PatientForm } from "@/components/patients/patient-form";
import { toast } from "sonner";

export default function NewPatientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      return await api.post("/patients", formData);
    },
    onSuccess: () => {
      toast.success("Paciente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push("/patients");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Erro ao cadastrar paciente. Verifique os dados.");
    },
  });

  return (
    <div className="container max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="w-fit pl-0 hover:bg-transparent text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para listagem
        </Button>
        <h1 className="text-4xl font-bold tracking-tight text-primary italic">
          Novo Paciente
        </h1>
        <p className="text-muted-foreground">
          Siga os passos abaixo para registrar o novo paciente no sistema.
        </p>
      </div>

      <div className="bg-card border border-border/40 rounded-[32px] p-10 shadow-sm">
        <PatientForm 
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          isEditing={false}
        />
      </div>
    </div>
  );
}