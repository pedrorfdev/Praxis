"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPatientById, updatePatient } from "@/services/frontend-data";
import { toast } from "sonner";
import { PatientForm } from "@/components/patients/patient-form";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const patientId = params.id;

  const { data: patient, isLoading, isError } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      return getPatientById(String(patientId));
    },
    enabled: !!patientId,
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      return await updatePatient(String(patientId), formData);
    },
    onSuccess: () => {
      toast.success("Ficha do paciente atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
      router.back();
    },
    onError: () => {
      toast.error("Erro ao atualizar paciente. Tente novamente.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Paciente não encontrado.</p>
        <Button onClick={() => router.push("/patients")}>Voltar para a lista</Button>
      </div>
    );

    
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()} 
            className="pl-0 hover:bg-transparent -ml-1 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Editar Ficha Cadastral
          </h1>
          <p className="text-muted-foreground">
            Altere as informações básicas e de contato de {patient?.fullName}.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
        <PatientForm 
          initialData={patient} 
          onSubmit={(data) => updateMutation.mutate(data)}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
}