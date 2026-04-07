"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Check, CalendarIcon } from "lucide-react";

import {
  createPatientSchema,
  type CreatePatientInput,
} from "@praxis/core/domain";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <span className="text-xs font-medium text-destructive">{message}</span>
  ) : null;

interface NewPatientDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewPatientDialog({
  open,
  onOpenChange,
  onSuccess,
}: NewPatientDialogProps) {
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
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
    },
  });

  const patientType = watch("type");

  useEffect(() => {
    if (!open && mounted) {
      reset();
      setStep(1);
    }
  }, [open, reset, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { mutateAsync: createPatient, isPending } = useMutation({
    mutationFn: async (data: CreatePatientInput) => {
      const response = await api.post("/patients", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Paciente cadastrado!");
      onOpenChange?.(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error creating patient:", error);
      toast.error("Erro ao cadastrar paciente. Tente novamente.");
      onOpenChange?.(false);
    },
  });

  const nextStep = async () => {
    const stepsFields: Record<number, any[]> = {
      1: ["fullName", "birthDate", "gender", "cpf"],
      2: ["address", "city", "phone", "birthPlace"],
      3: [
        "diagnosis",
        "religion",
        "maritalStatus",
        "educationLevel",
        "profession",
        "responsibleName",
      ],
    };
    const isValid = await trigger(stepsFields[step]);
    if (!isValid) {
      console.log("Erros atuais:", errors);
    }
    console.log("ta passando: ", step, isValid);

    if (isValid) setStep((s) => s + 1);
  };

  const onSubmit = (data: CreatePatientInput) => {
    console.log(data);
  };
  const onError = (errors: any) => {
    console.error("❌ Erros de Validação:", errors);
  };

  if (!mounted) return null;

  return (
    <DialogContent className="sm:max-w-(--container-5xl) p-0 overflow-hidden border-none bg-background rounded-[32px] shadow-2xl">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-1 flex-col h-[85vh] max-h-[800px]"
      >
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-3xl italic text-primary">
              Novo Paciente
            </DialogTitle>
            <div className="flex gap-2 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? "bg-secondary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Tabs
                onValueChange={field.onChange}
                value={field.value}
                className="w-full transition-all duration-500"
              >
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-0 rounded-xl">
                  <TabsTrigger value="ADULT" className="rounded-lg font-medium">
                    Adulto
                  </TabsTrigger>
                  <TabsTrigger value="CHILD" className="rounded-lg font-medium">
                    Criança / Adolescente
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="py-4 space-y-8 px-8">
            {step === 1 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Nome do Paciente
                  </Label>
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field }) => (
                      <Input
                        className="bg-muted/10 border-none h-12 text-lg"
                        {...field}
                      />
                    )}
                  />
                  <FieldError message={errors.fullName?.message as string} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Nascimento
                    </Label>
                    <Controller
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-muted/10 border-none h-12 rounded-xl",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(new Date(field.value), "PPP", {
                                  locale: ptBR,
                                })
                              ) : (
                                <span>Selecione a data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-2xl"
                            align="start"
                          >
                            <Calendar
                              captionLayout="dropdown"
                              mode="single"
                              startMonth={new Date(1920, 0)}
                              endMonth={new Date()}
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Gênero
                    </Label>
                    <Controller
                      control={control}
                      name="gender"
                      render={({ field }) => (
                        <Input
                          className="bg-muted/10 border-none h-12"
                          {...field}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      CPF
                    </Label>
                    <Controller
                      control={control}
                      name="cpf"
                      render={({ field }) => (
                        <PatternFormat
                          format="###.###.###-##"
                          mask="_"
                          customInput={Input}
                          className="bg-muted/10 border-none h-12"
                          onValueChange={(v) => field.onChange(v.value)}
                          value={field.value}
                        />
                      )}
                    />
                    <FieldError message={errors.cpf?.message as string} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Endereço Residencial
                  </Label>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Input
                        className="bg-muted/10 border-none h-12"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Cidade
                    </Label>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Input
                          className="bg-muted/10 border-none h-12"
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Telefone
                    </Label>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <PatternFormat
                          format="(##) #####-####"
                          mask="_"
                          customInput={Input}
                          className="bg-muted/10 border-none h-12"
                          onValueChange={(v) => field.onChange(v.value)}
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                      Naturalidade
                    </Label>
                    <Controller
                      control={control}
                      name="birthPlace"
                      render={({ field }) => (
                        <Input
                          className="bg-muted/10 border-none h-12"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-right-4">
                {patientType === "ADULT" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                        Estado Civil
                      </Label>
                      <Controller
                        control={control}
                        name="maritalStatus"
                        render={({ field }) => (
                          <Input
                            className="bg-muted/10 border-none h-12"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                        Escolaridade
                      </Label>
                      <Controller
                        control={control}
                        name="educationLevel"
                        render={({ field }) => (
                          <Input
                            className="bg-muted/10 border-none h-12"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                        Profissão
                      </Label>
                      <Controller
                        control={control}
                        name="profession"
                        render={({ field }) => (
                          <Input
                            className="bg-muted/10 border-none h-12"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Religião
                  </Label>
                  <Controller
                    control={control}
                    name="religion"
                    render={({ field }) => (
                      <Input
                        className="bg-muted/10 border-none h-12"
                        {...field}
                      />
                    )}
                  />
                </div>

                {patientType === "CHILD" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Responsável Legal
                      </Label>
                      <Controller
                        control={control}
                        name="responsibleName"
                        render={({ field }) => (
                          <Input
                            className="bg-background border-none h-10 shadow-sm"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-secondary font-bold">
                        Contato Responsável
                      </Label>
                      <Controller
                        control={control}
                        name="responsiblePhone"
                        render={({ field }) => (
                          <PatternFormat
                            format="(##) #####-####"
                            mask="_"
                            customInput={Input}
                            className="bg-background border-none h-10 shadow-sm"
                            onValueChange={(v) => field.onChange(v.value)}
                            value={field.value}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground italic text-center">
                  Os dados clínicos e anamnese detalhada serão preenchidos
                  durante a consulta.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 pt-4 flex items-center justify-between sm:justify-between border-t border-border/40 bg-muted/5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className={
              step === 1 ? "invisible" : "rounded-full px-6 hover:bg-muted"
            }
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="rounded-full px-10 bg-primary text-primary-foreground font-semibold"
            >
              Próximo <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-full px-12 bg-secondary text-secondary-foreground font-bold shadow-xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95"
            >
              {isPending ? (
                "Processando..."
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" /> Concluir Cadastro
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
