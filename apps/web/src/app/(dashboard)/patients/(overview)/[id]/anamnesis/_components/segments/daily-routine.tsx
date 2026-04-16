"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function DailyRoutine() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {[
          { id: "sleep", label: "Sono", placeholder: "Dorme bem? Acorda à noite? Horários?" },
          { id: "food", label: "Alimentação", placeholder: "Seletividade, mastigação, autonomia..." },
          { id: "hygiene", label: "Higiene / Autocuidado", placeholder: "Fraldas, banho, escovação..." },
          { id: "leisure", label: "Brincar e Lazer", placeholder: "Brinca sozinho? Interage com brinquedos?" },
        ].map((item) => (
          <div key={item.id} className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/70">{item.label}</label>
            <textarea
              {...register(`routine.${item.id}`)}
              disabled={isLocked}
              placeholder={item.placeholder}
              className="w-full min-h-[80px] bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}