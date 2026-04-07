"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Save } from "lucide-react";
import { useFormContext } from "react-hook-form";

const segments = [
  {
    id: "complaint",
    label: "Queixa Principal",
    fields: ["complaint.description"],
  },
  {
    id: "gestational",
    label: "Histórico Gestacional",
    fields: ["gestational.weeks"],
  },
  { id: "neuro", label: "Desenv. Neuro", fields: ["neuro.walking_age"] },
  {
    id: "physical",
    label: "Desenv. Físico",
    fields: ["physical.sleep_pattern"],
  },
  { id: "school", label: "Escolaridade", fields: ["school.grade"] },
  { id: "social", label: "Comportamento", fields: ["social.interaction"] },
  { id: "family", label: "Dinâmica Familiar", fields: ["family.environment"] },
  { id: "background", label: "Antecedentes", fields: ["background.cases"] },
  { id: "exams", label: "Exames", fields: ["exams.done"] },
  { id: "obs", label: "Observações", fields: ["obs.final"] },
];

export function AnamnesisStepper() {
  const {
    watch,
    formState: { errors },
  } = useFormContext();
  const formValues = watch();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const getStatus = (fields: string[]) => {
    const isFilled = fields.every((field) => {
      const value = watch(field as any);
      return value && value.length > 0;
    });

    const hasError = fields.some((field) => {
      const keys = field.split(".");
      const fieldError = keys.reduce((obj: any, key) => obj?.[key], errors);
      return !!fieldError;
    });

    if (hasError) return "error";
    if (isFilled) return "complete";
    return "pending";
  };

  return (
    <nav className="bg-card border border-border/40 rounded-[2rem] p-4 shadow-sm space-y-4">
      <ul className="space-y-1">
        {segments.map((item, index) => {
          const status = getStatus(item.fields);

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group",
                  "hover:bg-secondary/5 active:scale-[0.98]",
                )}
              >
                <div className="relative flex items-center justify-center">
                  {status === "complete" ? (
                    <CheckCircle2 className="h-4 w-4 text-secondary animate-in zoom-in duration-300" />
                  ) : (
                    <Circle
                      className={cn(
                        "h-4 w-4 transition-colors",
                        status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground group-hover:text-secondary",
                      )}
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-tighter transition-colors",
                      status === "complete"
                        ? "text-secondary/70"
                        : "text-muted-foreground",
                    )}
                  >
                    Passo {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      status === "complete"
                        ? "text-primary/60 line-through decoration-secondary/30"
                        : "text-primary/80 group-hover:text-primary",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="pt-4 border-t border-border/20">
        <Button
          type="submit"
          className="w-full bg-secondary text-secondary-foreground font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all h-12"
        >
          <Save className="w-4 h-4 mr-2" />
          Finalizar Anamnese
        </Button>
        <p className="text-[9px] text-center text-muted-foreground mt-3 uppercase font-black tracking-widest opacity-60">
          Dados salvos localmente
        </p>
      </div>
    </nav>
  );
}
