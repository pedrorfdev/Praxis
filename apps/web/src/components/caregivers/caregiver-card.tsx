"use client";

import { AlertCircle, Eye, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CaregiverSummary } from "@/mocks/entities";

type CaregiverCardProps = {
  caregiver: CaregiverSummary;
  onDelete: () => void;
};

export function CaregiverCard({ caregiver, onDelete }: CaregiverCardProps) {
  const router = useRouter();
  const initials = caregiver.name
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
              onClick={(event) => event.stopPropagation()}
              className="h-8 w-8 rounded-full hover:bg-accent"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-48 bg-popover border-border text-popover-foreground">
            <DropdownMenuItem onClick={() => router.push(`/caregivers/${caregiver.id}`)} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" /> Visualizar Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/caregivers/${caregiver.id}/edit`)} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" /> Editar Dados
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remover Registro
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
            {caregiver.name}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-8 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Contato</span>
          <span className="font-medium text-foreground">{caregiver.phone}</span>
        </div>
        <StatusBadge
          status={caregiver.status}
          className="rounded-full text-xs uppercase tracking-wider py-1 px-3"
        />
        <Badge
          variant={caregiver.patientCount > 0 ? "secondary" : "outline"}
          className="rounded-full text-xs uppercase tracking-wider py-1 px-3 flex items-center gap-1"
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
