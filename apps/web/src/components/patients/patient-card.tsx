"use client";

import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import type { PatientSummary } from "@/mocks/entities";

type PatientCardProps = {
  patient: PatientSummary;
  onDelete: () => void;
};

export function PatientCard({ patient, onDelete }: PatientCardProps) {
  const router = useRouter();
  const initials = patient.fullName
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <Card
      onClick={() => router.push(`/patients/${patient.id}`)}
      className="group border border-border/40 bg-card/50 rounded-xl shadow-sm hover:border-secondary/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      <div className="absolute top-4 right-2 z-10" onClick={(event) => event.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-40">
            <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
              <Eye className="w-4 h-4 mr-2" /> Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/patients/${patient.id}/edit`);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={(event) => {
                event.stopPropagation();
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
          <p className="text-xs text-muted-foreground italic">{patient.diagnosis}</p>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Última Evolução</span>
          <span className="font-medium text-foreground">{patient.lastSession}</span>
        </div>
        <StatusBadge
          status={patient.status}
          className="rounded-full text-xs uppercase tracking-wider py-1 px-3"
        />
      </CardContent>
    </Card>
  );
}
