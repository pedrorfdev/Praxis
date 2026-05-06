"use client";

import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function Schooling() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {[
          {
            id: "schoolName",
            label: "Escola / Instituição",
            placeholder: "Nome da escola e período (manhã/tarde)...",
          },
          {
            id: "grade",
            label: "Série / Ano",
            placeholder: "Ex: 2º ano do ensino fundamental...",
          },
          {
            id: "difficulties",
            label: "Dificuldades escolares",
            placeholder: "Leitura, escrita, atenção, comportamento...",
          },
          {
            id: "teacherFeedback",
            label: "Feedback de professores",
            placeholder: "Observações relevantes compartilhadas pela escola...",
          },
        ].map((item) => (
          <div key={item.id} className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
              {item.label}
            </label>
            <textarea
              {...register(`schooling.${item.id}`)}
              disabled={isLocked}
              placeholder={item.placeholder}
              className="w-full min-h-20 bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
