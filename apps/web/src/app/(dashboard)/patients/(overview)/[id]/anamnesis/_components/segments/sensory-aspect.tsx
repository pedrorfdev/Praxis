"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function SensoryAspects() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {[
          { id: "sounds", label: "Sensibilidade a sons (Barulhos altos, liquidificador...)" },
          { id: "lights", label: "Luzes e Estímulos Visuais" },
          { id: "textures", label: "Texturas (Roupas, etiquetas, areia, alimentos...)" },
        ].map((item) => (
          <div key={item.id} className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/70">{item.label}</label>
            <textarea
              {...register(`sensory.${item.id}`)}
              disabled={isLocked}
              className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}