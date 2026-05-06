"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCaregiverSchema, type CreateCaregiverInput } from "@praxis/core/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Save, Loader2, Heart, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface CaregiverFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function CaregiverForm({ initialData, onSubmit, isLoading }: CaregiverFormProps) {
  const [step, setStep] = useState(1);
  const isEdit = !!initialData?.id;

  const { register, handleSubmit, trigger, control, formState: { errors } } = useForm<CreateCaregiverInput>({
    resolver: zodResolver(createCaregiverSchema),
    defaultValues: initialData || {
      isActive: true,
    },
  });

  const nextStep = async () => {
    const fields: any = {
      1: ["name", "document"],
      2: ["phone", "email", "zipCode", "address"],
    };
    
    const isValid = await trigger(fields[step]);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card/40 border border-border/40 p-10 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-muted">
        <div 
          className="h-full bg-secondary transition-all duration-500" 
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-end mb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
            {isEdit ? <Heart className="text-secondary" /> : <UserPlus className="text-secondary" />}
            {isEdit ? "Editar Cuidador" : "Novo Cuidador"}
          </h2>
          <p className="text-muted-foreground text-sm italic">Passo {step} de 2 — {step === 1 ? "Identificação" : step === 2 ? "Contato e Endereço" : "Vínculo"}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-4xl font-black text-muted-foreground/30 leading-none">0{step}</span>
          <div className="flex items-center gap-2 mt-2">
            <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Status</Label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold uppercase", field.value ? "text-emerald-500" : "text-amber-500")}>
                    {field.value ? "Ativo" : "Pausado"}
                  </span>
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-6 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</Label>
            <Input {...register("name")} placeholder="Ex: Mariana Silva" className="bg-background/50 h-14 rounded-2xl border-border" />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">CPF (Documento)</Label>
            <Input {...register("document")} placeholder="000.000.000-00" className="bg-background/50 h-14 rounded-2xl border-border" />
            <FieldError message={errors.document?.message} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-6 animate-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</Label>
              <Input {...register("phone")} placeholder="(11) 99999-9999" className="bg-background/50 h-14 rounded-2xl border-border" />
              <FieldError message={errors.phone?.message} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">CEP</Label>
              <Input {...register("zipCode")} placeholder="00000-000" className="bg-background/50 h-14 rounded-2xl border-border" />
              <FieldError message={errors.zipCode?.message} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Endereço Completo</Label>
            <Input {...register("address")} placeholder="Rua, Número, Bairro" className="bg-background/50 h-14 rounded-2xl border-border" />
            <FieldError message={errors.address?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail</Label>
            <Input {...register("email")} placeholder="exemplo@email.com" className="bg-background/50 h-14 rounded-2xl border-border" />
            <FieldError message={errors.email?.message} />
          </div>
        </div>
      )}

      <div className="flex justify-between gap-4 pt-4">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={prevStep} className="h-14 px-8 rounded-2xl font-bold">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        ) : <div />}

        {step < 2 ? (
          <Button type="button" onClick={nextStep} className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold ml-auto">
            Próximo <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading} className="h-14 px-10 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black text-lg">
            {isLoading ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            Finalizar
          </Button>
        )}
      </div>
    </form>
  );
}
