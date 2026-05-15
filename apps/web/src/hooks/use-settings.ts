"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  settingsClinicSchema,
  settingsPasswordSchema,
  settingsProfileSchema,
  type SettingsClinicInput,
  type SettingsLocalClinicData,
  type SettingsPasswordInput,
  type SettingsProfileInput,
} from "@praxis/core/domain";
import { api } from "@/lib/api";

type ClinicApiResponse = {
  id: string;
  name: string;
  email: string;
};

const emptyLocalData: SettingsLocalClinicData = {
  crefito: "",
  cnpj: "",
  cityState: "",
  address: "",
};

function getStorageKey(clinicId: string) {
  return `praxis:settings:clinic:${clinicId}`;
}

function readClinicLocalData(clinicId: string): SettingsLocalClinicData {
  if (typeof window === "undefined") return emptyLocalData;

  const raw = localStorage.getItem(getStorageKey(clinicId));
  if (!raw) return emptyLocalData;

  try {
    const parsed = JSON.parse(raw);
    return {
      crefito: parsed.crefito ?? "",
      cnpj: parsed.cnpj ?? "",
      cityState: parsed.cityState ?? "",
      address: parsed.address ?? "",
    };
  } catch {
    return emptyLocalData;
  }
}

function saveClinicLocalData(clinicId: string, data: SettingsLocalClinicData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStorageKey(clinicId), JSON.stringify(data));
}

export function useSettings() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingClinic, setIsEditingClinic] = useState(false);
  const queryClient = useQueryClient();

  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic-me"],
    queryFn: async () => {
      const response = await api.get<ClinicApiResponse>("/clinics/me");
      return response.data;
    },
  });

  const profileForm = useForm<SettingsProfileInput>({
    resolver: zodResolver(settingsProfileSchema),
    defaultValues: { name: "", crefito: "" },
  });

  const clinicForm = useForm<SettingsClinicInput>({
    resolver: zodResolver(settingsClinicSchema),
    defaultValues: {
      clinicName: "",
      cnpj: "",
      cityState: "",
      address: "",
    },
  });

  const passwordForm = useForm<SettingsPasswordInput>({
    resolver: zodResolver(settingsPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const localData = useMemo(() => {
    if (!clinic?.id) return emptyLocalData;
    return readClinicLocalData(clinic.id);
  }, [clinic?.id]);

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
    mutationFn: async (payload: {
      name?: string;
      password?: string;
      currentPassword?: string;
    }) => {
      const response = await api.patch<ClinicApiResponse>("/clinics/me", payload);
      return response.data;
    },
    onSuccess: (updatedClinic) => {
      queryClient.setQueryData(["clinic-me"], updatedClinic);
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
      await updateClinicMutation.mutateAsync({
        currentPassword: values.currentPassword,
        password: values.newPassword,
      });
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

  return {
    clinic,
    isLoading,
    isSaving: updateClinicMutation.isPending,
    profileForm,
    clinicForm,
    passwordForm,
    isEditingProfile,
    isEditingClinic,
    setIsEditingProfile,
    setIsEditingClinic,
    handleSaveProfile,
    handleSaveClinic,
    handleChangePassword,
    cancelProfileEdit,
    cancelClinicEdit,
  };
}
