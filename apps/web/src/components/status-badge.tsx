"use client";

import { Badge } from "@/components/ui/badge";
import type { PatientStatus } from "@/mocks/entities";

type StatusBadgeProps = {
  status: PatientStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={status === "Ativo" ? "secondary" : "outline"}
      className={className ?? "text-xs"}
    >
      {status}
    </Badge>
  );
}
