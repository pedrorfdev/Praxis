"use client";

import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SettingsFormActionsProps = {
  isEditing: boolean;
  isSaving?: boolean;
  saveLabel: string;
  onEdit: () => void;
  onCancel: () => void;
};

export function SettingsFormActions({
  isEditing,
  isSaving,
  saveLabel,
  onEdit,
  onCancel,
}: SettingsFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      {isEditing ? (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-2xl h-14 px-8 font-bold"
          >
            <X className="h-4 w-4 mr-2" /> Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black"
          >
            <Save className="h-4 w-4 mr-2" /> {saveLabel}
          </Button>
        </>
      ) : (
        <Button
          type="button"
          onClick={onEdit}
          className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black"
        >
          <Pencil className="h-4 w-4 mr-2" /> Editar
        </Button>
      )}
    </div>
  );
}
