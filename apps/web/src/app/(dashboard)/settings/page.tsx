"use client";

import { Building, Shield, User } from "lucide-react";
import { ClinicSettingsForm } from "@/components/settings/clinic-settings-form";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SecuritySettingsForm } from "@/components/settings/security-settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/use-settings";

export default function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground italic text-sm">
          Gerencie sua identidade profissional e os dados da sua clínica.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-muted border border-border p-1 mb-10 h-14 rounded-2xl w-full sm:w-fit">
          <TabsTrigger value="profile" className="gap-2 rounded-xl px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold transition-all">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="clinic" className="gap-2 rounded-xl px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold transition-all">
            <Building className="h-4 w-4" /> Clínica
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-xl px-8 h-full data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold transition-all">
            <Shield className="h-4 w-4" /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in slide-in-from-bottom-2 duration-400 outline-none">
          <ProfileSettingsForm
            form={settings.profileForm}
            email={settings.clinic?.email}
            isEditing={settings.isEditingProfile}
            isLoading={settings.isLoading}
            isSaving={settings.isSaving}
            onSubmit={settings.handleSaveProfile}
            onEdit={() => settings.setIsEditingProfile(true)}
            onCancel={settings.cancelProfileEdit}
          />
        </TabsContent>

        <TabsContent value="clinic" className="space-y-6 animate-in slide-in-from-bottom-2 duration-400 outline-none">
          <ClinicSettingsForm
            form={settings.clinicForm}
            isEditing={settings.isEditingClinic}
            isLoading={settings.isLoading}
            isSaving={settings.isSaving}
            onSubmit={settings.handleSaveClinic}
            onEdit={() => settings.setIsEditingClinic(true)}
            onCancel={settings.cancelClinicEdit}
          />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in slide-in-from-bottom-2 duration-400 outline-none">
          <SecuritySettingsForm
            form={settings.passwordForm}
            isSaving={settings.isSaving}
            onSubmit={settings.handleChangePassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
