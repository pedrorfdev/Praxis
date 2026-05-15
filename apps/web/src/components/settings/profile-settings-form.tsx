"use client";

import { ClipboardList, Mail, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SettingsProfileInput } from "@praxis/core/domain";
import { Input } from "@/components/ui/input";
import { MaskedSettingsField, SettingsField } from "@/components/settings/settings-field";
import { SettingsFormActions } from "@/components/settings/settings-form-actions";

type ProfileSettingsFormProps = {
  form: UseFormReturn<SettingsProfileInput>;
  email?: string;
  isEditing: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: () => void;
  onEdit: () => void;
  onCancel: () => void;
};

export function ProfileSettingsForm({
  form,
  email,
  isEditing,
  isLoading,
  isSaving,
  onSubmit,
  onEdit,
  onCancel,
}: ProfileSettingsFormProps) {
  const disabled = !isEditing || isLoading;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm">
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <SettingsField
            label="Nome Profissional"
            icon={User}
            registration={form.register("name")}
            error={form.formState.errors.name?.message}
            disabled={disabled}
            readOnly={!isEditing}
            className="rounded-2xl h-14 pl-12 font-medium"
          />

          <MaskedSettingsField
            label="Registro (CRP/CREFITO)"
            icon={ClipboardList}
            format="##/#####"
            value={form.watch("crefito")}
            onValueChange={(value) =>
              form.setValue("crefito", value, { shouldValidate: true })
            }
            error={form.formState.errors.crefito?.message}
            disabled={disabled}
            readOnly={!isEditing}
          />

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={email ?? ""}
                className="rounded-2xl h-14 pl-12 opacity-50 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground italic ml-1">
              * O e-mail não pode ser alterado diretamente por questões de segurança.
            </p>
          </div>
        </div>

        <SettingsFormActions
          isEditing={isEditing}
          isSaving={isSaving}
          saveLabel="Salvar Alterações"
          onEdit={onEdit}
          onCancel={onCancel}
        />
      </div>
    </form>
  );
}
