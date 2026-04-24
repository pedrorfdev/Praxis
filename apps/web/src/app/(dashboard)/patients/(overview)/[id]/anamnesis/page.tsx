"use client";

import { useFormContext } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lock, LockOpen, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upsertAnamnesis } from "@/services/frontend-data";
import { MainComplaint } from "./_components/segments/main-complaint";
import { GestationalHistory } from "./_components/segments/gestational-history";
import { NeonatalHistory } from "./_components/segments/neonatal-history";
import {
  ANAMNESIS_STEPS,
  useAnamnesis,
} from "./_components/anamnesis-provider";
import { NeuroDevelopment } from "./_components/segments/neuro-development";
import { SocialInteraction } from "./_components/segments/social-interaction";
import { DiagnosisHistory } from "./_components/segments/diagnosis-history";
import { DailyRoutine } from "./_components/segments/daily-routine";
import { FamilyContext } from "./_components/segments/family-context";
import { FamilyExpectations } from "./_components/segments/family-expectations";
import { BehaviorRegulation } from "./_components/segments/behavior-regulation";
import { PatientMiniHeader } from "./_components/patient-mini-header";
import { cn } from "@/lib/utils";

export default function AnamnesisPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [isSaving, setIsSaving] = useState(false);
  const { currentStep, nextStep, prevStep, isLastStep, isLocked, setIsLocked } = useAnamnesis();
  const { handleSubmit } = useFormContext();

  const onFinalSubmit = async (data: any) => {
    const sanitize = (obj: any): any => {
      return Object.keys(obj).reduce((acc: any, key) => {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          acc[key] = sanitize(value);
        } else {
          acc[key] =
            value === "" || value === undefined || value === null
              ? "Não informado"
              : value;
        }
        return acc;
      }, {});
    };

    const cleanData = sanitize(data);
    
    setIsSaving(true);
    try {
      await upsertAnamnesis(patientId, cleanData);
      toast.success("Anamnese finalizada e salva com sucesso!");
      
      // Redirect to patient overview after success
      setTimeout(() => {
        router.push(`/patients/${patientId}`);
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao salvar anamnese";
      toast.error(errorMessage);
      console.error("Erro ao salvar anamnese:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSegment = () => {
    switch (currentStep) {
      case "queixa-principal":
        return <MainComplaint />;
      case "historico-gestacional":
        return <GestationalHistory />;
      case "historico-neonatal":
        return <NeonatalHistory />;
      case "desenvolvimento-neuro":
        return <NeuroDevelopment />;
      case "desenvolvimento-linguagem":
        return <SocialInteraction />;
      case "historico-medico":
        return <DiagnosisHistory />;
      case "comportamento-social":
        return <BehaviorRegulation />;
      case "alimentacao-sono":
        return <DailyRoutine />;
      case "historico-familiar":
        return <FamilyContext />;
      case "escolaridade":
        return <DailyRoutine />;
      case "expectativas":
        return <FamilyExpectations />;
      default:
        return <MainComplaint />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PatientMiniHeader />

      <div className="flex flex-col max-w-7xl mx-auto w-full px-4">
        <div className="flex justify-end mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLocked(!isLocked)}
            disabled={isSaving}
            className={cn(
              "rounded-xl border-2 gap-2 font-bold uppercase tracking-widest text-xs transition-all cursor-pointer",
              isLocked 
                ? "border-zinc-800 text-zinc-500 hover:bg-zinc-800" 
                : "border-secondary/50 text-secondary bg-secondary/5"
            )}
          >
            {isLocked ? (
              <><Lock className="w-3 h-3" /> Modo Visualização Ativado</>
            ) : (
              <><LockOpen className="w-3 h-3" /> Modo Edição Ativado</>
            )}
          </Button>
        </div>

        <div className="flex-1">{renderSegment()}</div>

        <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === ANAMNESIS_STEPS[0] || isSaving}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {!isLastStep ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSaving}
              className="bg-secondary text-secondary-foreground font-bold px-8 rounded-xl hover:scale-105 transition-all"
            >
              Próximo Passo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onFinalSubmit)}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Finalizar Anamnese
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
