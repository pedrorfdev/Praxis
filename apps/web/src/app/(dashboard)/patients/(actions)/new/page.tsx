"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPatient } from "@/services/frontend-data";
import { PatientForm } from "@/components/patients/patient-form";
import { toast } from "sonner";

export default function NewPatientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      return await createPatient(formData);
    },
    onSuccess: (data: any) => {
      toast.success("Paciente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      router.push(`/patients/${data.id}/anamnesis`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Erro ao cadastrar paciente. Verifique os dados.");
    },
  });

  return (
    <div className="space-y-8 p-8 pt-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
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

      <PatientForm 
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        isEditing={false}
      />
    </div>
  );
}