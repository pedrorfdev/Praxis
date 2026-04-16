"use client";
import { cn } from "@/lib/utils";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function DiagnosisHistory() {
  const { control, register } = useFormContext();
  const usesMedication = useWatch({
    control,
    name: "diagnosis.uses_medication",
  });
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Diagnóstico
          </label>
          <input
            {...register("diagnosis.description")}
            disabled={isLocked}
            placeholder="Ex: TEA Nível 1, TDAH, etc."
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Como descobriu?
          </label>
          <input
            {...register("diagnosis.discovery_method")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Idade do diagnóstico
          </label>
          <input
            {...register("diagnosis.age_at_diagnosis")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3 col-span-full">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Acompanhamentos
          </label>
          <input
            {...register("diagnosis.follow_ups")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md mt-3"
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Uso de medicação?
          </label>
          
          <Controller
            name="diagnosis.uses_medication"
            control={control}
            render={({ field }) => (
              <div className="flex gap-4 mt-2">
                {["Sim", "Não"].map((op) => {
                  const isActive = field.value === op;
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => field.onChange(op)}
                      className={cn(
                        "flex-1 p-3 rounded-lg border text-xs font-bold transition-all duration-200",
                        isActive 
                          ? "border-secondary bg-secondary/10 text-secondary" 
                          : "border-border bg-card text-muted-foreground"
                      )}
                    >
                      {op}
                    </button>
                  );
                })}
                disabled={isLocked}
              </div>
            )}
          />
        </div>

        {/* Agora o condicional usa o valor do useWatch */}
        {usesMedication === "Sim" && (
          <div className="space-y-3 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black uppercase tracking-widest text-secondary/70 text-emerald-500/80">
              Quais medicações?
            </label>
            <textarea 
              {...register("diagnosis.medication_details")} 
              className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md" 
              placeholder="Descreva..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
