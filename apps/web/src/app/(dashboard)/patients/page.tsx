"use client";

import { useState } from "react";
import { Loader2, Plus, SearchX, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientList } from "@/components/patients/patient-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ViewModeToolbar, type ViewMode } from "@/components/view-mode-toolbar";
import { deletePatient, listPatients } from "@/services/frontend-data";
import type { PatientSummary } from "@/mocks/entities";

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
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
        {hasSearch ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[360px] mb-6">
        {hasSearch
          ? "Tente buscar por outro nome ou limpe o filtro para ver todos."
          : "Cadastre seu primeiro paciente para começar a gerenciar sua clínica."}
      </p>
      {!hasSearch && (
        <Button
          onClick={() => router.push("/patients/new")}
          className="rounded-2xl bg-secondary text-secondary-foreground px-6 h-10 font-bold hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> Cadastrar Paciente
        </Button>
      )}
    </div>
  );
}

export default function PatientsPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<PatientSummary | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success("Paciente removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setPatientToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao remover paciente.");
    },
  });

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8">
      <ConfirmDeleteDialog
        open={!!patientToDelete}
        description={
          <>
            Tem certeza que deseja remover o paciente{" "}
            <strong>{patientToDelete?.fullName}</strong>? Esta ação não pode ser desfeita e todos os dados vinculados serão perdidos.
          </>
        }
        confirmLabel="Excluir Paciente"
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => !open && setPatientToDelete(null)}
        onConfirm={() => patientToDelete && deleteMutation.mutate(patientToDelete.id)}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Meus Pacientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de pacientes e prontuários.</p>
        </div>

        <Button
          onClick={() => router.push("/patients/new")}
          className="rounded-2xl shadow-lg hover:scale-105 transition-all bg-secondary text-secondary-foreground px-8 h-12 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      <ViewModeToolbar
        search={search}
        view={view}
        searchPlaceholder="Buscar paciente..."
        onSearchChange={setSearch}
        onViewChange={setView}
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" /> Atualizando base de dados...
        </div>
      ) : null}

      {!isLoading && filteredPatients.length === 0 ? (
        <EmptyState hasSearch={search.length > 0} />
      ) : (
        <Tabs value={view} className="w-full">
          <TabsContent value="grid" className="mt-0 outline-none">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDelete={() => setPatientToDelete(patient)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0 outline-none">
            <PatientList patients={filteredPatients} onDelete={setPatientToDelete} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
