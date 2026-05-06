"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  User,
  Building,
  Shield,
  Mail,
  Lock,
  KeyRound,
  MapPin,
  Hash,
  ClipboardList,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldError } from "@/components/ui/field-error";
import { api } from "@/lib/api";

const profileSchema = z.object({
  name: z.string().min(3, "Nome profissional deve ter no mínimo 3 caracteres"),
  crefito: z
    .string()
    .min(1, "Registro é obrigatório")
    .regex(/^\d{2}\/\d{5}$/, "Formato inválido. Use 00/00000"),
});

const clinicSchema = z.object({
  clinicName: z.string().min(3, "Nome da clínica deve ter no mínimo 3 caracteres"),
  cnpj: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), {
      message: "Formato inválido. Use 00.000.000/0000-00",
    }),
  cityState: z.string().min(3, "Cidade/UF é obrigatório"),
  address: z.string().min(5, "Endereço muito curto"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, "Nova senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Nova senha deve conter uma letra maiúscula")
      .regex(/[0-9]/, "Nova senha deve conter um número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type ClinicFormData = z.infer<typeof clinicSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

type ClinicApiResponse = {
  id: string;
  name: string;
  email: string;
};

function getStorageKey(clinicId: string) {
  return `praxis:settings:clinic:${clinicId}`;
}

function readClinicLocalData(clinicId: string) {
  if (typeof window === "undefined") {
    return { crefito: "", cnpj: "", cityState: "", address: "" };
  }

  const raw = localStorage.getItem(getStorageKey(clinicId));
  if (!raw) {
    return { crefito: "", cnpj: "", cityState: "", address: "" };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      crefito: parsed.crefito ?? "",
      cnpj: parsed.cnpj ?? "",
      cityState: parsed.cityState ?? "",
      address: parsed.address ?? "",
    };
  } catch {
    return { crefito: "", cnpj: "", cityState: "", address: "" };
  }
}

function saveClinicLocalData(
  clinicId: string,
  data: { crefito: string; cnpj: string; cityState: string; address: string },
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(clinicId), JSON.stringify(data));
}

export default function SettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingClinic, setIsEditingClinic] = useState(false);

  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic-me"],
    queryFn: async () => {
      const response = await api.get<ClinicApiResponse>("/clinics/me");
      return response.data;
    },
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      crefito: "",
    },
  });

  const clinicForm = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      clinicName: "",
      cnpj: "",
      cityState: "",
      address: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const clinicId = clinic?.id ?? "";

  const localData = useMemo(() => {
    if (!clinicId) return { crefito: "", cnpj: "", cityState: "", address: "" };
    return readClinicLocalData(clinicId);
  }, [clinicId]);

  useEffect(() => {
    if (!clinic) return;

    profileForm.reset({
      name: clinic.name,
      crefito: localData.crefito,
    });

    clinicForm.reset({
      clinicName: clinic.name,
      cnpj: localData.cnpj,
      cityState: localData.cityState,
      address: localData.address,
    });
  }, [clinic, localData, profileForm, clinicForm]);

  const updateClinicMutation = useMutation({
    mutationFn: async (payload: { name?: string; password?: string }) => {
      const response = await api.patch("/clinics/me", payload);
      return response.data;
    },
  });

  const handleSaveProfile = profileForm.handleSubmit(async (values) => {
    if (!clinic) return;

    try {
      await updateClinicMutation.mutateAsync({ name: values.name });
      saveClinicLocalData(clinic.id, {
        crefito: values.crefito,
        cnpj: clinicForm.getValues("cnpj") ?? "",
        cityState: clinicForm.getValues("cityState"),
        address: clinicForm.getValues("address"),
      });
      toast.success("Dados do perfil salvos com sucesso.");
      setIsEditingProfile(false);
    } catch {
      toast.error("Erro ao salvar dados do perfil.");
    }
  });

  const handleSaveClinic = clinicForm.handleSubmit(async (values) => {
    if (!clinic) return;

    try {
      await updateClinicMutation.mutateAsync({ name: values.clinicName });
      saveClinicLocalData(clinic.id, {
        crefito: profileForm.getValues("crefito"),
        cnpj: values.cnpj ?? "",
        cityState: values.cityState,
        address: values.address,
      });
      toast.success("Dados da clínica salvos com sucesso.");
      setIsEditingClinic(false);
    } catch {
      toast.error("Erro ao salvar dados da clínica.");
    }
  });

  const handleChangePassword = passwordForm.handleSubmit(async (values) => {
    try {
      await updateClinicMutation.mutateAsync({ password: values.newPassword });
      toast.success("Senha alterada com sucesso.");
      passwordForm.reset();
    } catch {
      toast.error("Erro ao alterar senha.");
    }
  });

  const cancelProfileEdit = () => {
    if (!clinic) return;
    const data = readClinicLocalData(clinic.id);
    profileForm.reset({ name: clinic.name, crefito: data.crefito });
    setIsEditingProfile(false);
  };

  const cancelClinicEdit = () => {
    if (!clinic) return;
    const data = readClinicLocalData(clinic.id);
    clinicForm.reset({
      clinicName: clinic.name,
      cnpj: data.cnpj,
      cityState: data.cityState,
      address: data.address,
    });
    setIsEditingClinic(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">Configurações</h1>
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
          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm">
            <div className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome Profissional</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...profileForm.register("name")}
                      className="rounded-2xl h-14 pl-12 font-medium"
                      disabled={!isEditingProfile || isLoading}
                      readOnly={!isEditingProfile}
                    />
                  </div>
                  <FieldError message={profileForm.formState.errors.name?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Registro (CRP/CREFITO)</label>
                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <PatternFormat
                      format="##/#####"
                      mask="_"
                      customInput={Input}
                      className="rounded-2xl h-14 pl-12"
                      disabled={!isEditingProfile || isLoading}
                      readOnly={!isEditingProfile}
                      value={profileForm.watch("crefito")}
                      onValueChange={(values) => profileForm.setValue("crefito", values.formattedValue, { shouldValidate: true })}
                    />
                  </div>
                  <FieldError message={profileForm.formState.errors.crefito?.message} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail de Acesso</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input value={clinic?.email ?? ""} className="rounded-2xl h-14 pl-12 opacity-50 cursor-not-allowed" disabled />
                  </div>
                  <p className="text-xs text-muted-foreground italic ml-1">* O e-mail não pode ser alterado diretamente por questões de segurança.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {isEditingProfile ? (
                  <>
                    <Button type="button" variant="outline" onClick={cancelProfileEdit} className="rounded-2xl h-14 px-8 font-bold">
                      <X className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                    <Button type="submit" className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black">
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditingProfile(true)} className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black">
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="clinic" className="space-y-6 animate-in slide-in-from-bottom-2 duration-400 outline-none">
          <form onSubmit={handleSaveClinic} className="rounded-3xl border border-border bg-card p-8 md:p-12 space-y-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Clínica / Consultório</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...clinicForm.register("clinicName")}
                    className="rounded-2xl h-14 pl-12 font-medium"
                    disabled={!isEditingClinic || isLoading}
                    readOnly={!isEditingClinic}
                  />
                </div>
                <FieldError message={clinicForm.formState.errors.clinicName?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CNPJ (Opcional)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <PatternFormat
                    format="##.###.###/####-##"
                    mask="_"
                    customInput={Input}
                    className="rounded-2xl h-14 pl-12"
                    disabled={!isEditingClinic || isLoading}
                    readOnly={!isEditingClinic}
                    value={clinicForm.watch("cnpj") ?? ""}
                    onValueChange={(values) => clinicForm.setValue("cnpj", values.formattedValue, { shouldValidate: true })}
                  />
                </div>
                <FieldError message={clinicForm.formState.errors.cnpj?.message} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cidade / UF</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...clinicForm.register("cityState")}
                    className="rounded-2xl h-14 pl-12"
                    disabled={!isEditingClinic || isLoading}
                    readOnly={!isEditingClinic}
                  />
                </div>
                <FieldError message={clinicForm.formState.errors.cityState?.message} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Endereço Completo</label>
                <Input
                  {...clinicForm.register("address")}
                  className="rounded-2xl h-14 px-6 font-medium"
                  disabled={!isEditingClinic || isLoading}
                  readOnly={!isEditingClinic}
                />
                <FieldError message={clinicForm.formState.errors.address?.message} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {isEditingClinic ? (
                <>
                  <Button type="button" variant="outline" onClick={cancelClinicEdit} className="rounded-2xl h-14 px-8 font-bold">
                    <X className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                  <Button type="submit" className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black">
                    <Save className="h-4 w-4 mr-2" /> Atualizar Dados da Clínica
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditingClinic(true)} className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black">
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </Button>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in slide-in-from-bottom-2 duration-400 outline-none">
          <form onSubmit={handleChangePassword} className="rounded-3xl border border-border bg-card p-8 md:p-12 max-w-2xl">
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2 italic">
                  <KeyRound className="h-5 w-5 text-secondary" /> Alterar Senha
                </h3>
                <p className="text-muted-foreground text-xs">Recomendamos uma senha forte com pelo menos 8 caracteres.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Senha Atual</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="password" {...passwordForm.register("currentPassword")} placeholder="••••••••" className="rounded-2xl h-14 pl-12" />
                  </div>
                  <FieldError message={passwordForm.formState.errors.currentPassword?.message} />
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nova Senha</label>
                    <Input type="password" {...passwordForm.register("newPassword")} placeholder="••••••••" className="rounded-2xl h-14 px-6" />
                    <FieldError message={passwordForm.formState.errors.newPassword?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirmar Nova Senha</label>
                    <Input type="password" {...passwordForm.register("confirmPassword")} placeholder="••••••••" className="rounded-2xl h-14 px-6" />
                    <FieldError message={passwordForm.formState.errors.confirmPassword?.message} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-secondary text-secondary-foreground rounded-2xl px-12 h-14 font-black">
                  Redefinir Senha
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
