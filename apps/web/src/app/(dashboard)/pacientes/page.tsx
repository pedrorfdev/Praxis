"use client"

import { useState } from "react"
import { LayoutGrid, List, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewPatientDialog } from "@/components/new-patient-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, FileText, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const mockPatients = [
  { id: "1", name: "João Silva", diagnosis: "TEA", status: "Ativo", lastSession: "20/03/2026" },
  { id: "2", name: "Maria Oliveira", diagnosis: "TDAH", status: "Ativo", lastSession: "21/03/2026" },
  { id: "3", name: "Pedro Santos", diagnosis: "Coordenação Motora", status: "Pausado", lastSession: "15/02/2026" },
]

export default function PatientsPage() {
  const [view, setView] = useState("grid")

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Meus Pacientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de pacientes e prontuários.</p>
        </div>
        <NewPatientDialog />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-secondary/5 p-2 rounded-2xl border border-border/40">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar paciente..." 
            className="pl-10 bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-secondary/50"
          />
        </div>

        <Tabs value={view} onValueChange={setView} className="w-fit">
          <TabsList className="bg-background border border-border/50">
            <TabsTrigger value="grid" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Cards
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={view} className="w-full">
        <TabsContent value="grid" className="mt-0 outline-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-0 outline-none">
          <div className="rounded-xl border border-border/50 bg-card">
             <PatientList patients={mockPatients} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PatientCard({ patient }: { patient: any }) {
  const initials = patient.name.split(' ').map((n: string) => n[0]).join('')

  return (
    <Link href={`/pacientes/${patient.id}`} className="block group">
      <Card className="group border border-border/40 bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <Avatar className="h-12 w-12 border-2 border-secondary/20 group-hover:border-secondary/50 transition-colors">
            <AvatarFallback className="bg-secondary/10 text-secondary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-bold text-primary leading-tight group-hover:text-secondary transition-colors">
              {patient.name}
            </h3>
            <span className="text-xs text-muted-foreground">{patient.diagnosis}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Última Sessão</span>
            <span className="font-medium">{patient.lastSession}</span>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant={patient.status === "Ativo" ? "secondary" : "outline"} className="rounded-md text-[10px] uppercase tracking-wider">
              {patient.status}
            </Badge>
            <button className="text-[10px] font-bold text-secondary uppercase hover:underline">
              Ver Prontuário
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function PatientList({ patients }: { patients: any[] }) {
  const router = useRouter()
  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/5">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="w-[300px] font-bold text-primary">Paciente</TableHead>
            <TableHead className="font-bold text-primary text-center">Diagnóstico</TableHead>
            <TableHead className="font-bold text-primary text-center">Status</TableHead>
            <TableHead className="font-bold text-primary text-center">Última Sessão</TableHead>
            <TableHead className="text-right font-bold text-primary">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="group border-border/40 hover:bg-secondary/5 transition-colors" onClick={() => router.push(`/pacientes/${patient.id}`)}>
              <TableCell>
                <div className="flex items-center gap-3">
                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all">
                    {patient.name.split(' ').map((n: string) => n[0]).join('')}
                   </div>
                   <div className="flex flex-col">
                     <span className="font-semibold text-sm">{patient.name}</span>
                     <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                       <Phone className="h-2 w-2" /> (55) 99999-9999
                     </span>
                   </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className="bg-background text-[10px] border-border/60">
                  {patient.diagnosis}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${patient.status === 'Ativo' ? 'bg-secondary animate-pulse' : 'bg-muted-foreground'}`} />
                  <span className="text-xs font-medium">{patient.status}</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {patient.lastSession}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-2 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-secondary" title="Ver Prontuário">
                    <FileText className="h-4 w-4" />
                  </button>
                  <button className="p-2 hover:bg-background rounded-md transition-colors text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}