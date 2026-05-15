"use client";

import { useState } from "react";
import { Loader2, Plus, SearchX, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { CaregiverList } from "@/components/caregivers/caregiver-list";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ViewModeToolbar, type ViewMode } from "@/components/view-mode-toolbar";
import { deleteCaregiver, listCaregivers } from "@/services/frontend-data";
import type { CaregiverSummary } from "@/mocks/entities";

function CaregiverEmptyState({ hasSearch }: { hasSearch: boolean }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="h-20 w-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
        {hasSearch ? (
          <SearchX className="h-10 w-10 text-muted-foreground/60" />
        ) : (
          <UserPlus className="h-10 w-10 text-secondary" />
        )}
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">
        {hasSearch ? "Nenhum cuidador encontrado" : "Nenhum cuidador cadastrado"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[360px] mb-6">
        {hasSearch
          ? "Tente buscar por outro nome, CPF ou WhatsApp."
          : "Cadastre o primeiro responsável para vincular aos seus pacientes."}
      </p>
      {!hasSearch && (
        <Button
          onClick={() => router.push("/caregivers/new")}
          className="rounded-2xl bg-secondary text-secondary-foreground px-6 h-10 font-bold hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Cadastrar Cuidador
        </Button>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function CaregiversPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [caregiverToDelete, setCaregiverToDelete] = useState<CaregiverSummary | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: caregivers = [], isLoading } = useQuery({
    queryKey: ["caregivers"],
    queryFn: listCaregivers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCaregiver,
    onSuccess: () => {
      toast.success("Cuidador removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      setCaregiverToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao remover cuidador. Verifique se ele ainda possui pacientes vinculados.");
    },
  });

  const filteredCaregivers = caregivers.filter((caregiver) => {
    const digits = search.replace(/\D/g, "");
    const matchName = normalize(caregiver.name).includes(normalize(search));
    const matchDocument = caregiver.document?.replace(/\D/g, "").includes(digits);
    const matchPhone = caregiver.phone?.replace(/\D/g, "").includes(digits);

    return matchName || Boolean(digits && (matchDocument || matchPhone));
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <ConfirmDeleteDialog
        open={!!caregiverToDelete}
        description={
          <>
            Tem certeza que deseja remover o cuidador{" "}
            <strong>{caregiverToDelete?.name}</strong>? Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir Cuidador"
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => !open && setCaregiverToDelete(null)}
        onConfirm={() => caregiverToDelete && deleteMutation.mutate(caregiverToDelete.id)}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
            Cuidadores
          </h1>
          <p className="text-muted-foreground italic">
            Gerencie os responsáveis e contatos de emergência.
          </p>
        </div>

        <Button
          onClick={() => router.push("/caregivers/new")}
          className="rounded-2xl shadow-lg hover:scale-105 transition-all bg-secondary text-secondary-foreground px-8 h-12 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Cuidador
        </Button>
      </div>

      <ViewModeToolbar
        search={search}
        view={view}
        searchPlaceholder="Busque por nome, CPF ou WhatsApp..."
        onSearchChange={setSearch}
        onViewChange={setView}
      />

      {isLoading ? (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-secondary" />
          Sincronizando base de cuidadores...
        </div>
      ) : null}

      {!isLoading && filteredCaregivers.length === 0 ? (
        <CaregiverEmptyState hasSearch={search.length > 0} />
      ) : (
        <Tabs value={view} className="w-full">
          <TabsContent value="grid" className="mt-0 outline-none">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCaregivers.map((caregiver) => (
                <CaregiverCard
                  key={caregiver.id}
                  caregiver={caregiver}
                  onDelete={() => setCaregiverToDelete(caregiver)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-0 outline-none">
            <CaregiverList caregivers={filteredCaregivers} onDelete={setCaregiverToDelete} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
