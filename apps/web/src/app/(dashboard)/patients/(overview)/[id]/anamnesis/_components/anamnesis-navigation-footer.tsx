"use client";

import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANAMNESIS_STEPS, useAnamnesis } from "./anamnesis-provider";

export function AnamnesisNavigationFooter() {
  const { currentStep, setStep } = useAnamnesis();

  const currentIndex = ANAMNESIS_STEPS.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === ANAMNESIS_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setStep(ANAMNESIS_STEPS[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setStep(ANAMNESIS_STEPS[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        disabled={isFirstStep}
        className="gap-2 rounded-2xl text-muted-foreground hover:text-primary disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Button>

      {isLastStep ? (
        <Button
          type="submit"
          className="gap-2 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 shadow-[0_0_20px_rgba(var(--secondary),0.3)] transition-all"
        >
          Finalizar Anamnese
          <Check className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleNext}
          className="gap-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-secondary/20 hover:text-secondary hover:border-secondary/40 px-8 transition-all group"
        >
          Próximo Bloco
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      )}
    </div>
  );
}