"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function BehaviorRegulation() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">Crises comportamentais</label>
          <textarea 
            {...register("behavior.crises_description")}
            disabled={isLocked}
            placeholder="Frequência, intensidade, como ocorrem..." 
            className="w-full min-h-[100px] bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">Gatilhos identificados</label>
          <input 
            {...register("behavior.triggers")}
            disabled={isLocked}
            placeholder="Ex: Mudança de rotina, barulhos, frustração..." 
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">Estratégias que acalmam</label>
          <textarea 
            {...register("behavior.calming_strategies")}
            disabled={isLocked}
            placeholder="O que ajuda a regular a criança no momento da crise?" 
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>
      </div>
    </div>
  );
}