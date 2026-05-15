"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RowActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function RowActions({ onView, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={onView} title="Ver detalhes">
        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onEdit} title="Editar">
        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Remover"
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
