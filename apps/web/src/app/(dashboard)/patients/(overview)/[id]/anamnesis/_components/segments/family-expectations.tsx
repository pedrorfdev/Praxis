"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function FamilyExpectations() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-primary tracking-tight text-emerald-400">Finalização</h2>
        <p className="text-sm text-muted-foreground font-medium">O que a família espera do processo terapêutico.</p>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">Principais Expectativas e Observações Finais</label>
        <textarea 
          {...register("expectations.final_notes")}
          disabled={isLocked}
          placeholder="Quais os maiores desejos da família para o desenvolvimento da criança?" 
          className="w-full min-h-[250px] bg-card border border-border rounded-lg p-8 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
        />
      </div>
    </div>
  );
}