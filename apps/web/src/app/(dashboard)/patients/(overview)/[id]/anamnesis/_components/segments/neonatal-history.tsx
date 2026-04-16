"use client";

import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function NeonatalHistory() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-primary tracking-tight">
          Histórico Neonatal
        </h2>
        <p className="text-sm text-muted-foreground font-medium">
          Detalhes sobre o nascimento e os primeiros dias de vida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Tipo de Parto
          </label>
          <select
            {...register("neonatal.delivery_type")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md appearance-none"
          >
            <option value="vaginal" className="bg-[#0A0C10]">Normal / Vaginal</option>
            <option value="cesarea" className="bg-[#0A0C10]">Cesárea</option>
            <option value="forceps" className="bg-[#0A0C10]">Fórceps</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Peso ao Nascer (kg)
          </label>
          <input
            {...register("neonatal.birth_weight")}
            disabled={isLocked}
            type="text"
            placeholder="Ex: 3.250"
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Idade Gestacional (Semanas)
          </label>
          <input
            {...register("neonatal.gestational_age")}
            disabled={isLocked}
            type="number"
            placeholder="Ex: 38"
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Chorou ao nascer?
          </label>
          <select
            {...register("neonatal.cried_at_birth")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md appearance-none"
          >
            <option value="sim" className="bg-[#0A0C10]">Sim</option>
            <option value="nao" className="bg-[#0A0C10]">Não</option>
            <option value="demorou" className="bg-[#0A0C10]">Demorou a chorar</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Precisou de UTI?
          </label>
          <select
            {...register("neonatal.icu_needed")}
            disabled={isLocked}
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md appearance-none"
          >
            <option value="nao" className="bg-[#0A0C10]">Não</option>
            <option value="sim" className="bg-[#0A0C10]">Sim</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Apgar (1º/5º min)
          </label>
          <input
            {...register("neonatal.apgar_score")}
            disabled={isLocked}
            type="text"
            placeholder="Ex: 9/10"
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
          />
        </div>

        <div className="space-y-3 md:col-span-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70 ml-1">
            Intercorrências no Parto ou Pós-parto imediato
          </label>
          <textarea
            {...register("neonatal.post_birth_complications")}
            disabled={isLocked}
            placeholder="Ex: Icterícia, fototerapia, dificuldade na amamentação..."
            className="w-full min-h-[100px] bg-card border border-border rounded-lg p-6 text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary/40 focus:shadow-md leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}