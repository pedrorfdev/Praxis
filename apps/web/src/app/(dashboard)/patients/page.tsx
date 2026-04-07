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
import { NewPatientDialog } from "@/components/patients/new-patient-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const mockPatients = [
  {
    id: "1",
    name: "João Silva",
    diagnosis: "TEA",
    status: "Ativo",
    lastSession: "20/03/2026",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    diagnosis: "TDAH",
    status: "Ativo",
    lastSession: "21/03/2026",
  },
  {
    id: "3",
    name: "Pedro Santos",
    diagnosis: "Coordenação Motora",
    status: "Pausado",
    lastSession: "15/02/2026",
  },
];

export default function PatientsPage() {
  const [view, setView] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredPatients = mockPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const {
    data: apiPatients,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await api.get("/patients");
      return response.data;
    },
    enabled: true,
  });

  const displayData = mockPatients;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Meus Pacientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua base de pacientes e prontuários.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover:scale-105 transition-all bg-primary text-primary-foreground px-6">
              <Plus className="w-4 h-4 mr-2" /> Novo Paciente
            </Button>
          </DialogTrigger>
          <NewPatientDialog open={isModalOpen} onOpenChange={setIsModalOpen} />
        </Dialog>
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
          <Loader2 className="h-3 w-3 animate-spin" /> Atualizando base de dados...
        </div>
      )}

      <Tabs value={view} className="w-full">
        <TabsContent value="grid" className="mt-0 outline-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0 outline-none">
          <PatientList patients={filteredPatients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatientCard({ patient }: { patient: any }) {
  const router = useRouter();
  const initials = patient.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <Card
      onClick={() => router.push(`/pacientes/${patient.id}`)}
      className="group border border-border/40 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
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
              onClick={() => router.push(`/pacientes/${patient.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" /> Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-12 w-12 border-2 border-secondary/20">
          <AvatarFallback className="bg-secondary/10 text-secondary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col pr-6">
          <h3 className="font-bold text-primary truncate max-w-[140px]">
            {patient.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {patient.diagnosis}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Última Sessão</span>
          <span className="font-medium text-foreground">
            {patient.lastSession}
          </span>
        </div>
        <Badge
          variant={patient.status === "Ativo" ? "secondary" : "outline"}
          className="rounded-md text-[10px] uppercase tracking-wider"
        >
          {patient.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function PatientList({ patients }: { patients: any[] }) {
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {patient.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {patient.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground italic">
                      {patient.diagnosis}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={patient.status === "Ativo" ? "secondary" : "outline"}
                  className="text-[10px]"
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
                    onClick={() => router.push(`/pacientes/${patient.id}`)}
                    title="Ver Detalhes"
                  >
                    <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Editar">
                    <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
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
