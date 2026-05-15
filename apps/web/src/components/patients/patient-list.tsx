"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/row-actions";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PatientSummary } from "@/mocks/entities";

type PatientListProps = {
  patients: PatientSummary[];
  onDelete: (patient: PatientSummary) => void;
};

export function PatientList({ patients, onDelete }: PatientListProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/5">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="font-bold text-primary">Paciente</TableHead>
            <TableHead className="font-bold text-primary text-center">Status</TableHead>
            <TableHead className="font-bold text-primary text-center">Última Sessão</TableHead>
            <TableHead className="text-right font-bold text-primary px-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="group border-border/40 hover:bg-secondary/5 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {patient.fullName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{patient.fullName}</span>
                    <span className="text-xs text-muted-foreground italic">
                      {patient.diagnosis}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <StatusBadge status={patient.status} />
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {patient.lastSession}
              </TableCell>
              <TableCell className="text-right px-6">
                <RowActions
                  onView={() => router.push(`/patients/${patient.id}`)}
                  onEdit={() => router.push(`/patients/${patient.id}/edit`)}
                  onDelete={() => onDelete(patient)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
