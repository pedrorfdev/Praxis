"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { getPatientAnamnesis } from "@/services/frontend-data";

export const ANAMNESIS_STEPS = [
  "queixa-principal",
  "historico-gestacional",
  "historico-neonatal",
  "desenvolvimento-neuro",
  "desenvolvimento-linguagem",
  "historico-medico",
  "comportamento-social",
  "alimentacao-sono",
  "historico-familiar",
  "escolaridade",
  "expectativas",
];

const AnamnesisContext = createContext<any>(null);

export function AnamnesisProvider({
  children,
  patientId,
}: {
  children: React.ReactNode;
  patientId: string;
}) {
  const [currentStep, setStep] = useState("queixa-principal");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const storageKey = `praxis-anamnesis-${patientId}`;

  const methods = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    let isMounted = true;

    const loadAnamnesis = async () => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          methods.reset(JSON.parse(saved));
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      try {
        const response = await getPatientAnamnesis(patientId);
        const serverContent = response?.content;
        const hasServerContent =
          serverContent &&
          typeof serverContent === "object" &&
          Object.keys(serverContent).length > 0;

        if (isMounted && hasServerContent) {
          methods.reset(serverContent);
        }
      } catch (error) {
        console.warn("Falha ao carregar anamnese salva do backend:", error);
      }
    };

    loadAnamnesis();

    return () => {
      isMounted = false;
    };
  }, [methods.reset, patientId, storageKey]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods.watch, storageKey]);

  const nextStep = () => {
    const currentIndex = ANAMNESIS_STEPS.indexOf(currentStep);
    if (currentIndex < ANAMNESIS_STEPS.length - 1) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      const next = ANAMNESIS_STEPS[currentIndex + 1];
      setStep(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleStepCheck = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId],
    );
  };

  const prevStep = () => {
    const currentIndex = ANAMNESIS_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(ANAMNESIS_STEPS[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnamnesisContext.Provider
      value={{
        currentStep,
        setStep,
        completedSteps,
        nextStep,
        prevStep,
        isLastStep: currentStep === ANAMNESIS_STEPS[ANAMNESIS_STEPS.length - 1],
        toggleStepCheck,
        isLocked,
        setIsLocked,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </AnamnesisContext.Provider>
  );
}

export const useAnamnesis = () => useContext(AnamnesisContext);
