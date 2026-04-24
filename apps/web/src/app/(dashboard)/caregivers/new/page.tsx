"use client";

import { CaregiverForm } from "@/components/caregivers/caregivers-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCaregiver } from "@/services/frontend-data";
import { toast } from "sonner";

export default function NewCaregiverPage() {

  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCaregiver,
    onSuccess: () => {
      toast.success("Cuidador cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      router.push("/caregivers");
    },
    onError: (error) => {
      console.error("Erro ao salvar cuidador:", error);
      toast.error("Erro ao salvar cuidador. Verifique os dados e tente novamente.");
    }
  });

  const handleSave = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-8 p-8 pt-6 w-5xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Link 
        href="/caregivers" 
        className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <CaregiverForm onSubmit={handleSave} />
    </div>
  );
}