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
import type { CaregiverSummary } from "@/mocks/entities";

type CaregiverListProps = {
  caregivers: CaregiverSummary[];
  onDelete: (caregiver: CaregiverSummary) => void;
};

export function CaregiverList({ caregivers, onDelete }: CaregiverListProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/5">
          <TableRow className="hover:bg-transparent border-border/40">
            <TableHead className="font-bold text-primary">Cuidador</TableHead>
            <TableHead className="font-bold text-primary text-center">Status</TableHead>
            <TableHead className="font-bold text-primary text-center">Documento</TableHead>
            <TableHead className="font-bold text-primary text-center">Telefone</TableHead>
            <TableHead className="text-right font-bold text-primary px-6">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {caregivers.map((caregiver) => (
            <TableRow
              key={caregiver.id}
              className="group border-border/40 hover:bg-secondary/5 transition-colors cursor-pointer"
              onClick={() => router.push(`/caregivers/${caregiver.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
                    {caregiver.name.split(" ").map((name) => name[0]).join("")}
                  </div>
                  <span className="font-semibold text-sm">{caregiver.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <StatusBadge status={caregiver.status} />
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {caregiver.document}
              </TableCell>
              <TableCell className="text-center text-xs text-muted-foreground">
                {caregiver.phone}
              </TableCell>
              <TableCell className="text-right px-6" onClick={(event) => event.stopPropagation()}>
                <RowActions
                  onView={() => router.push(`/caregivers/${caregiver.id}`)}
                  onEdit={() => router.push(`/caregivers/${caregiver.id}/edit`)}
                  onDelete={() => onDelete(caregiver)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
