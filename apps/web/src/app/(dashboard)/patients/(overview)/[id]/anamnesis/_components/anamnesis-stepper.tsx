"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useAnamnesis, ANAMNESIS_STEPS } from "./anamnesis-provider";

export function AnamnesisStepper() {
  const { currentStep, setStep, completedSteps, toggleStepCheck } = useAnamnesis();

  return (
    <nav className="bg-card border border-border rounded-[2.5rem] p-5 shadow-sm space-y-6 sticky top-8">
      <div className="px-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60">
          Progresso
        </h3>
        <p className="text-sm font-bold text-foreground">Sessões da Anamnese</p>
      </div>

      <ul className="space-y-2">
        {ANAMNESIS_STEPS.map((stepId, index) => {
          const isActive = currentStep === stepId;
          const isDone = completedSteps.includes(stepId);

          return (
            <li key={stepId}>
              <button
                type="button"
                onClick={() => {
                  setStep(stepId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-2xl text-left transition-all duration-300 group relative",
                  isActive
                    ? "bg-secondary/10 border border-secondary/25"
                    : "hover:bg-muted border border-transparent",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-secondary rounded-full" />
                )}

                <div
                  className="flex items-center justify-center shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepCheck(stepId);
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-secondary animate-in zoom-in duration-300" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-secondary"
                          : "text-muted-foreground/40 group-hover:text-secondary/60",
                      )}
                    />
                  )}
                </div>

                <div className="flex flex-col overflow-hidden">
                  <span
                    className={cn(
                      "text-[8px] font-black uppercase tracking-widest transition-colors",
                      isActive ? "text-secondary" : "text-muted-foreground/50",
                    )}
                  >
                    Passo {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] font-bold truncate transition-colors capitalize",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground/80",
                      isDone && !isActive && "text-muted-foreground/40",
                    )}
                  >
                    {stepId.replace(/-/g, " ")}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight className="h-3 w-3 ml-auto text-secondary animate-in slide-in-from-left-2" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}