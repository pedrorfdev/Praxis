"use client";

import { CaregiverForm } from "@/components/caregivers/caregivers-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCaregiverById, updateCaregiver } from "@/services/frontend-data";
import { toast } from "sonner";

import { use } from "react";

export default function EditCaregiverPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: caregiver, isLoading } = useQuery({
    queryKey: ["caregiver", id],
    queryFn: () => getCaregiverById(id),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateCaregiver(id, data),
    onSuccess: () => {
      toast.success("Cuidador atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver", id] });
      router.push(`/caregivers/${id}`);
    },
    onError: (error) => {
      console.error("Erro ao atualizar cuidador:", error);
      toast.error("Erro ao atualizar cuidador. Tente novamente.");
    }
  });

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;

  const handleUpdate = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 w-5xl mx-auto animate-in fade-in duration-500">
      <Link 
        href={`/caregivers/${id}`} 
        className="flex items-center gap-2 text-zinc-500 hover:text-secondary transition-colors text-sm font-bold"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <CaregiverForm initialData={caregiver} onSubmit={handleUpdate} />
    </div>
  );
}