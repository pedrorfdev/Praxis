"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const anamnesisSchema = z
  .object({
    identification: z.object({
      full_name: z.string().min(1, "Obrigatório"),
    }),
  })
  .optional();

export function AnamnesisProvider({
  children,
  patientId,
}: {
  children: React.ReactNode;
  patientId: string;
}) {
  const methods = useForm({
    resolver: zodResolver(anamnesisSchema as any),
    defaultValues: {},
  });

  const { watch, reset } = methods;
  const storageKey = `praxis-anamnesis-${patientId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) reset(JSON.parse(saved));
  }, [reset, storageKey]);

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);

  return <FormProvider {...methods}>{children}</FormProvider>;
}
