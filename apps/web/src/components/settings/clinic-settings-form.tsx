"use client";

import { Building, Hash, MapPin } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SettingsClinicInput } from "@praxis/core/domain";
import { MaskedSettingsField, SettingsField } from "@/components/settings/settings-field";
import { SettingsFormActions } from "@/components/settings/settings-form-actions";

type ClinicSettingsFormProps = {
  form: UseFormReturn<SettingsClinicInput>;
  isEditing: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: () => void;
  onEdit: () => void;
  onCancel: () => void;
};

export function ClinicSettingsForm({
  form,
  isEditing,
  isLoading,
  isSaving,
  onSubmit,
  onEdit,
  onCancel,
}: ClinicSettingsFormProps) {
  const disabled = !isEditing || isLoading;

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-12 space-y-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <SettingsField
            label="Nome da Clínica / Consultório"
            icon={Building}
            registration={form.register("clinicName")}
            error={form.formState.errors.clinicName?.message}
            disabled={disabled}
            readOnly={!isEditing}
            className="rounded-2xl h-14 pl-12 font-medium"
          />
        </div>

        <MaskedSettingsField
          label="CNPJ (Opcional)"
          icon={Hash}
          format="##.###.###/####-##"
          value={form.watch("cnpj") ?? ""}
          onValueChange={(value) =>
            form.setValue("cnpj", value, { shouldValidate: true })
          }
          error={form.formState.errors.cnpj?.message}
          disabled={disabled}
          readOnly={!isEditing}
        />

        <SettingsField
          label="Cidade / UF"
          icon={MapPin}
          registration={form.register("cityState")}
          error={form.formState.errors.cityState?.message}
          disabled={disabled}
          readOnly={!isEditing}
        />

        <div className="md:col-span-2">
          <SettingsField
            label="Endereço Completo"
            registration={form.register("address")}
            error={form.formState.errors.address?.message}
            disabled={disabled}
            readOnly={!isEditing}
            className="rounded-2xl h-14 px-6 font-medium"
          />
        </div>
      </div>

      <SettingsFormActions
        isEditing={isEditing}
        isSaving={isSaving}
        saveLabel="Atualizar Dados da Clínica"
        onEdit={onEdit}
        onCancel={onCancel}
      />
    </form>
  );
}
