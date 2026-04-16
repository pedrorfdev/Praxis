"use client";
import { useFormContext } from "react-hook-form";
import { useAnamnesis } from "../anamnesis-provider";

export function SocialInteraction() {
  const { register } = useFormContext();
  const { isLocked } = useAnamnesis();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Forma de comunicação predominante
          </label>
          <textarea
            {...register("social.communication_type")}
            disabled={isLocked}
            placeholder="Fala frases? Usa gestos? Aponta? Chora para pedir?"
            className="w-full bg-card border border-border rounded-lg p-4 text-foreground outline-none focus:border-secondary/40 focus:shadow-md transition-all"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-secondary/70">
            Contato Visual
          </label>
          <div className="flex gap-4">
            {["Sustenta", "Pouco", "Ausente", "Inconsistente"].map((op) => (
              <label key={op} className="flex-1">
                <input
                  type="radio"
                  {...register("social.eye_contact")}
                  disabled={isLocked}
                  value={op.toLowerCase()}
                  className="peer sr-only"
                />
                <div className="cursor-pointer text-center p-3 rounded-lg border border-border bg-card text-xs font-bold peer-checked:border-secondary/50 peer-checked:bg-secondary/10 peer-checked:text-secondary transition-all">
                  {op}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
