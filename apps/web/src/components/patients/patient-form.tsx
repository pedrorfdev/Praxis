"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { ChevronRight, ChevronLeft, Check, CalendarIcon, Loader2, UserPlus, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createPatientSchema } from "@praxis/core/domain";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCaregivers, createCaregiver } from "@/services/frontend-data";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/ui/field-error";
import { CaregiverForm } from "@/components/caregivers/caregivers-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface PatientFormProps {
  initialData?: any;
  isEditing?: boolean;
  isLoading?: boolean;
  onSubmit: (data: any) => void;
}

export function PatientForm({ initialData, isEditing, isLoading, onSubmit }: PatientFormProps) {
  const [step, setStep] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<any>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: initialData || {
      type: "ADULT",
      fullName: "",
      gender: "Masculino",
      maritalStatus: "Solteiro(a)",
      educationLevel: "Ensino Médio",
      religion: "Nenhuma",
      address: "",
      city: "",
      birthPlace: "",
      profession: "",
      birthDate: "",
      responsibleName: "",
      isActive: true,
    },
  });

  const {
    data: caregivers = [],
    isLoading: isLoadingCaregivers,
  } = useQuery({
    queryKey: ["caregivers"],
    queryFn: listCaregivers,
  });

  const createCaregiverMutation = useMutation({
    mutationFn: createCaregiver,
    onSuccess: (data) => {
      toast.success("Responsável cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caregivers"] });
      setValue("responsibleName", data.name);
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao cadastrar responsável.");
    },
  });

  const patientType = watch("type");

  const nextStep = async () => {
    if (isNavigating) return;
    
    const stepsFields: Record<number, any[]> = {
      1: ["fullName", "birthDate", "gender", "cpf", "responsibleName"],
      2: ["address", "city", "phone", "birthPlace"],
      3: ["religion", "maritalStatus", "educationLevel", "profession"],
    };

    const isValid = await trigger(stepsFields[step]);
    if (isValid) {
      setIsNavigating(true);
      setStep((s) => s + 1);
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  const prevStep = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setStep((s) => s - 1);
    setTimeout(() => setIsNavigating(false), 500);
  };

  return (
    <div className="space-y-8 mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-card/40 border border-border/40 p-10 rounded-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground flex items-center gap-3">
              <UserPlus className="text-secondary" />
              {isEditing ? "Editar Paciente" : "Novo Paciente"}
            </h2>
            <p className="text-muted-foreground text-sm italic">
              Passo {step} de 3 — {step === 1 ? "Identificação" : step === 2 ? "Dados Pessoais" : "Detalhes Clínicos"}
            </p>
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
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-4">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tipo de Perfil</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Tabs onValueChange={field.onChange} value={field.value} className="w-full max-w-md">
                    <TabsList className="grid grid-cols-2 bg-muted/50">
                      <TabsTrigger value="ADULT">Adulto</TabsTrigger>
                      <TabsTrigger value="CHILD">Criança / Adolescente</TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl text-lg px-4" {...field} />}
              />
              <FieldError message={errors.fullName?.message as string} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nascimento</Label>
                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left bg-background/50 border-border h-14 rounded-2xl px-4",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP", { locale: ptBR }) : "Selecione"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                          locale={ptBR}
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError message={errors.birthDate?.message as string} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Gênero</Label>
                <Controller control={control} name="gender" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                <FieldError message={errors.gender?.message as string} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">CPF</Label>
                <Controller
                  control={control}
                  name="cpf"
                  render={({ field }) => (
                    <PatternFormat
                      format="###.###.###-##"
                      mask="_"
                      customInput={Input}
                      className="bg-background/50 border-border h-14 rounded-2xl px-4"
                      onValueChange={(v) => field.onChange(v.value)}
                      value={field.value}
                    />
                  )}
                />
                <FieldError message={errors.cpf?.message as string} />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Responsável</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="responsibleName"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full bg-background/50 border border-border h-14 rounded-2xl px-4 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                        >
                          <option value="" disabled>
                            Selecione o responsável
                          </option>
                          {isLoadingCaregivers ? (
                            <option>Carregando...</option>
                          ) : (
                            caregivers.map((caregiver: any) => (
                              <option key={caregiver.id} value={caregiver.name}>
                                {caregiver.name}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                    />
                  </div>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 w-14 rounded-2xl border-dashed border-secondary/50 text-secondary hover:bg-secondary/10"
                      >
                        <PlusCircle className="h-6 w-6" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-none">
                      <CaregiverForm 
                        onSubmit={(data) => createCaregiverMutation.mutate(data)}
                        isLoading={createCaregiverMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <FieldError message={errors.responsibleName?.message as string} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Endereço Residencial</Label>
              <Controller control={control} name="address" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
              <FieldError message={errors.address?.message as string} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Cidade</Label>
                <Controller control={control} name="city" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                <FieldError message={errors.city?.message as string} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Telefone</Label>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      customInput={Input}
                      className="bg-background/50 border-border h-14 rounded-2xl px-4"
                      onValueChange={(v) => field.onChange(v.value)}
                      value={field.value}
                    />
                  )}
                />
                <FieldError message={errors.phone?.message as string} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Naturalidade</Label>
                <Controller control={control} name="birthPlace" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                <FieldError message={errors.birthPlace?.message as string} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Diagnóstico Principal</Label>
                <span className="text-[10px] text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full uppercase tracking-tighter">Opcional</span>
              </div>
              <Controller
                control={control}
                name="diagnosis"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full bg-background/50 border border-border h-14 rounded-2xl px-4 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
                  >
                    <option value="">Selecione depois (opcional)</option>
                    <option value="TDAH">TDAH</option>
                    <option value="TEA">TEA</option>
                    <option value="ANSIEDADE">Ansiedade</option>
                    <option value="DEPRESSAO">Depressão</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                )}
              />
              <FieldError message={errors.diagnosis?.message as string} />
            </div>

            {patientType === "ADULT" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Estado Civil</Label>
                  <Controller control={control} name="maritalStatus" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                  <FieldError message={errors.maritalStatus?.message as string} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Escolaridade</Label>
                  <Controller control={control} name="educationLevel" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                  <FieldError message={errors.educationLevel?.message as string} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Profissão</Label>
                  <Controller control={control} name="profession" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
                  <FieldError message={errors.profession?.message as string} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Religião</Label>
              <Controller control={control} name="religion" render={({ field }) => <Input className="bg-background/50 border-border h-14 rounded-2xl px-4" {...field} />} />
              <FieldError message={errors.religion?.message as string} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-8 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isNavigating}
            className={step === 1 ? "invisible" : "rounded-full px-6"}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isNavigating}
              className="rounded-full px-10 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-105 transition-all"
            >
              Próximo <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || isNavigating}
              className="rounded-full px-12 bg-secondary text-secondary-foreground font-bold shadow-xl shadow-secondary/20 transition-all hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Salvar Alterações" : "Concluir Cadastro"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}