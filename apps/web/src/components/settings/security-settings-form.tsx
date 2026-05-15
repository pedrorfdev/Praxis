"use client";

import { KeyRound, Lock } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { SettingsPasswordInput } from "@praxis/core/domain";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingsField } from "@/components/settings/settings-field";

type SecuritySettingsFormProps = {
  form: UseFormReturn<SettingsPasswordInput>;
  isSaving?: boolean;
  onSubmit: () => void;
};

export function SecuritySettingsForm({
  form,
  isSaving,
  onSubmit,
}: SecuritySettingsFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-12 max-w-2xl">
      <div className="space-y-8">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 italic">
            <KeyRound className="h-5 w-5 text-secondary" /> Alterar Senha
          </h3>
          <p className="text-muted-foreground text-xs">
            Recomendamos uma senha forte com pelo menos 8 caracteres.
          </p>
        </div>

        <div className="space-y-6">
          <SettingsField
            label="Senha Atual"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            registration={form.register("currentPassword")}
            error={form.formState.errors.currentPassword?.message}
          />

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <SettingsField
              label="Nova Senha"
              type="password"
              placeholder="••••••••"
              registration={form.register("newPassword")}
              error={form.formState.errors.newPassword?.message}
            />
            <SettingsField
              label="Confirmar Nova Senha"
              type="password"
              placeholder="••••••••"
              registration={form.register("confirmPassword")}
              error={form.formState.errors.confirmPassword?.message}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black"
          >
            Redefinir Senha
          </Button>
        </div>
      </div>
    </form>
  );
}
