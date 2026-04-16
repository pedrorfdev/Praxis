"use client";

import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function GestationalHistory() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-primary tracking-tight">
          Histórico Gestacional
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Informações sobre a gestação, pré-natal e intercorrências.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Idade da mãe na gestação
          </label>
          <input
            {...register("gestational.mother_age")}
            disabled={isLocked}
            type="number"
            placeholder="Ex: 28"
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Gravidez planejada?
          </label>
          <select
            {...register("gestational.planned")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md appearance-none"
          >
            <option value="sim" className="bg-[#0A0C10]">
              Sim
            </option>
            <option value="nao" className="bg-[#0A0C10]">
              Não
            </option>
          </select>
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Intercorrências ou doenças na gestação
          </label>
          <textarea
            {...register("gestational.complications")}
            disabled={isLocked}
            placeholder="Ex: Diabetes gestacional, hipertensão, viroses..."
            className="w-full min-h-[120px] bg-card border border-border rounded-lg p-6 text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary/40 focus:shadow-md leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
