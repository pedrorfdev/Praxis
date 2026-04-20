"use client";

import { useState } from "react";
import { 
  LayoutGrid, List, Plus, Search, MoreVertical, 
  Pencil, Eye, Phone, Loader2, Users, AlertCircle 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { listCaregivers } from "@/services/frontend-data";
import type { CaregiverSummary } from "@/mocks/entities";

export default function CaregiversPage() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: caregivers = [], isLoading } = useQuery({
    queryKey: ["caregivers"],
    queryFn: listCaregivers,
  });

  const filteredCaregivers = caregivers.filter((c: any) => {
    const searchTerm = search.toLowerCase().replace(/\D/g, "");
    const normalName = c.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const inputNormal = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const matchName = normalName.includes(inputNormal);
    const matchDocument = c.document?.replace(/\D/g, "").includes(searchTerm);
    const matchPhone = c.phone?.replace(/\D/g, "").includes(searchTerm);

    return matchName || (searchTerm && (matchDocument || matchPhone));
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-secondary/5 p-2 rounded-2xl border border-border/40">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Busque por nome, CPF ou WhatsApp..."
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
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-secondary" /> 
          Sincronizando base de cuidadores...
        </div>
      )}

      <Tabs value={view} className="w-full">
        <TabsContent value="grid" className="mt-0 outline-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCaregivers.map((caregiver) => (
              <CaregiverCard key={caregiver.id} caregiver={caregiver} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-0 outline-none">
          <CaregiverList caregivers={filteredCaregivers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CaregiverCard({ caregiver }: { caregiver: CaregiverSummary }) {
  const router = useRouter();
  const initials = caregiver.name.split(" ").filter(Boolean).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card
      onClick={() => router.push(`/caregivers/${caregiver.id}`)}
      className="group border border-border/40 bg-card/50 rounded-xl shadow-sm hover:border-secondary/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 rounded-full hover:bg-zinc-800"
            >
              <MoreVertical className="h-4 w-4 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-48 bg-zinc-950 border-zinc-800 text-white">
            <DropdownMenuItem onClick={() => router.push(`/caregivers/${caregiver.id}`)} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" /> Visualizar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/caregivers/${caregiver.id}/edit`)} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" /> Editar Dados
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
          <h3 className="font-bold text-primary text-lg leading-tight">{caregiver.name}</h3>
          <p className="text-xs text-muted-foreground italic">{"Vínculo não definido"}</p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Contato</span>
          <span className="font-medium text-foreground">{caregiver.phone}</span>
        </div>
        <Badge
          variant={caregiver.patientCount > 0 ? "secondary" : "outline"}
          className="rounded-full text-xs uppercase tracking-wider py-1 px-3"
        >
          {caregiver.patientCount > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" /> {caregiver.patientCount} Pacientes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Sem Vínculo
            </span>
          )}
        </Badge>
      </CardContent>
    </Card>
  );
}

function CaregiverList({ caregivers }: { caregivers: CaregiverSummary[] }) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/5">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="font-bold text-primary">Cuidador</TableHead>
            <TableHead className="font-bold text-primary text-center">Parentesco</TableHead>
            <TableHead className="font-bold text-primary text-center">Telefone</TableHead>
            <TableHead className="text-right font-bold text-primary px-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caregivers.map((c) => (
            <TableRow key={c.id} className="group border-border/40 hover:bg-secondary/5 transition-colors cursor-pointer" onClick={() => router.push(`/caregivers/${c.id}`)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    {c.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <span className="font-semibold text-sm">{c.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">{c.phone}</TableCell>
              <TableCell className="text-right px-6">
                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}