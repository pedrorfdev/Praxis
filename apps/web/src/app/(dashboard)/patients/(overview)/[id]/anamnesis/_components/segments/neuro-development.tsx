"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function NeuroDevelopment() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-primary tracking-tight">Desenvolvimento Neuropsicomotor</h2>
        <p className="text-sm text-muted-foreground font-medium">Marcos motores e de linguagem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: "head_control", label: "Controle Cervical (Sustentou a cabeça)", placeholder: "Ex: 3 meses" },
          { id: "sitting_age", label: "Sentar (Sem apoio)", placeholder: "Ex: 6-7 meses" },
          { id: "crawling_age", label: "Engatinhar", placeholder: "Ex: 9 meses" },
          { id: "walking_age", label: "Andar (Sem apoio)", placeholder: "Ex: 1 ano e 2 meses" },
        ].map((item) => (
          <div key={item.id} className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">{item.label}</label>
            <input
              {...register(`neuro.${item.id}`)}
              disabled={isLocked}
              placeholder={item.placeholder}
              className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md transition-all"
            />
          </div>
        ))}

        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">Linguagem (Primeiras palavras, balbucio)</label>
          <textarea
            {...register("neuro.language_notes")}
            disabled={isLocked}
            placeholder="Descreva como foi o início da fala e comunicação..."
            className="w-full min-h-[100px] bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md transition-all"
          />
        </div>
      </div>
    </div>
  );
}