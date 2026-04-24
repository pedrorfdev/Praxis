"use client";

import { useState } from "react";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Phone,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPatients, deletePatient } from "@/services/frontend-data";
import type { PatientSummary } from "@/mocks/entities";
import { toast } from "sonner";

export default function PatientsPage() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<PatientSummary | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: patients = [],
    isLoading,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      toast.success("Paciente removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setPatientToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao remover paciente.");
    }
  });

  const filteredPatients = patients.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Modal de Confirmação de Deleção */}
      <Dialog open={!!patientToDelete} onOpenChange={(open) => !open && setPatientToDelete(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o paciente <strong>{patientToDelete?.fullName}</strong>? 
              Esta ação não pode ser desfeita e todos os dados vinculados serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setPatientToDelete(null)} className="rounded-xl">
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => patientToDelete && deleteMutation.mutate(patientToDelete.id)}
              disabled={deleteMutation.isPending}
              className="rounded-xl"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir Paciente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Meus Pacientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua base de pacientes e prontuários.
          </p>
        </div>

        <Button
          onClick={() => router.push("/patients/new")}
          className="rounded-2xl shadow-lg hover:scale-105 transition-all bg-secondary text-secondary-foreground px-8 h-12 font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-secondary/5 p-2 rounded-2xl border border-border/40">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-secondary/50"
          />
        </div>

        <Tabs value={view} onValueChange={setView} className="w-fit">
          <TabsList className="bg-background border border-border/50">
            <TabsTrigger value="grid" className="gap-2">
              <LayoutGrid className="h-4 w-4" /> Cards
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" /> Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" /> Atualizando base de
          dados...
        </div>
      )}

      <Tabs value={view} className="w-full">
        <TabsContent value="grid" className="mt-0 outline-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} onDelete={() => setPatientToDelete(patient)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0 outline-none">
          <PatientList patients={filteredPatients} onDelete={(p) => setPatientToDelete(p)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatientCard({ patient, onDelete }: { patient: PatientSummary, onDelete: () => void }) {
  const router = useRouter();
  const initials = patient.fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <Card
      onClick={() => router.push(`/patients/${patient.id}`)}
      className="group border border-border/40 bg-card/50 rounded-xl shadow-sm hover:border-secondary/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      <div
        className="absolute top-4 right-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-40">
            <DropdownMenuItem
              onClick={() => router.push(`/patients/${patient.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" /> Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/patients/${patient.id}/edit`);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <CardHeader className="flex flex-col items-center text-center pt-8 pb-4">
        <Avatar className="h-20 w-20 border-4 border-secondary/20">
          <AvatarFallback className="bg-secondary/10 text-secondary font-bold text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 space-y-1">
          <h3 className="font-bold text-primary text-lg leading-tight">
            {patient.fullName}
          </h3>
          <p className="text-xs text-muted-foreground italic">
            {patient.diagnosis}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Última Evolução</span>
          <span className="font-medium text-foreground">
            {patient.lastSession}
          </span>
        </div>
        <Badge
          variant={patient.status === "Ativo" ? "secondary" : "outline"}
          className="rounded-full text-xs uppercase tracking-wider py-1 px-3"
        >
          {patient.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function PatientList({ patients, onDelete }: { patients: PatientSummary[], onDelete: (p: PatientSummary) => void }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/5">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="font-bold text-primary">Paciente</TableHead>
            <TableHead className="font-bold text-primary text-center">
              Status
            </TableHead>
            <TableHead className="font-bold text-primary text-center">
              Última Sessão
            </TableHead>
            <TableHead className="text-right font-bold text-primary px-6">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.id}
              className="group border-border/40 hover:bg-secondary/5 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {patient.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {patient.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground italic">
                      {patient.diagnosis}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={patient.status === "Ativo" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {patient.lastSession}
              </TableCell>
              <TableCell className="text-right px-6">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    title="Ver Detalhes"
                  >
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/patients/${patient.id}/edit`)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(patient)}
                    title="Remover"
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
