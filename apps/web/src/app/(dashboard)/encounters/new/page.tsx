"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Loader2,
  Clock8,
  Timer,
  Banknote,
  ShieldCheck,
  Lock,
  LockOpen,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EditorMenuBar } from "@/components/editor-menu-bar";
import { PatientSelector } from "@/components/patients-selector";
import { NumericFormat } from "react-number-format";
import { format, addMinutes, parse } from "date-fns";
import { cn } from "@/lib/utils";

function EncounterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const sessionId = searchParams.get("id");
  const patientIdFromUrl = searchParams.get("patientId");

  const [isLocked, setIsLocked] = useState(!!sessionId);

  const CustomTextStyle = TextStyle.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        fontSize: {
          default: null,
          parseHTML: (element) => element.style.fontSize,
          renderHTML: (attributes) => {
            if (!attributes.fontSize) return {};
            return { style: `font-size: ${attributes.fontSize}` };
          },
        },
      };
    },
  });

  const [selectedPatient, setSelectedPatient] = useState<string | null>(
    patientIdFromUrl,
  );
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [sessionValue, setSessionValue] = useState("");
  const [insurance, setInsurance] = useState("particular");

  const { data: existingSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const res = await api.get(`/encounters/${sessionId}`);
      return res.data;
    },
    enabled: !!sessionId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomTextStyle,
      Color,
      Placeholder.configure({ placeholder: "Descreva a evolução..." }),
    ],
    immediatelyRender: false,
    editable: !isLocked,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-slate max-w-full focus:outline-none min-h-screen p-12 rounded-b-lg border border-border/40 bg-card leading-relaxed transition-all",
          "text-foreground prose-headings:text-secondary prose-p:text-foreground/80 prose-strong:text-foreground",
          isLocked && "opacity-80 grayscale-[0.3] cursor-not-allowed",
        ),
      },
    },
    content: `<h2>Objetivo</h2><p></p><h2>Desenvolvimento</h2><p></p><h2>Comportamento</h2><p></p><h2>Orientações</h2><p></p>`,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLocked);
    }
  }, [isLocked, editor]);

  useEffect(() => {
    if (existingSession && editor) {
      setSelectedPatient(existingSession.patientId);
      setStartTime(format(new Date(existingSession.startAt), "HH:mm"));
      setDuration(String(existingSession.durationInMinutes));
      setInsurance(
        existingSession.billingType === "SUBSIDIZED" ? "cauzzo" : "particular",
      );
      editor.commands.setContent(existingSession.content);
    }
  }, [existingSession, editor]);

  useEffect(() => {
    if (!sessionId) setStartTime(format(new Date(), "HH:mm"));
  }, [sessionId]);

  const endTime = useMemo(() => {
    if (!startTime) return "--:--";
    try {
      const referenceDate = parse(startTime, "HH:mm", new Date());
      return format(addMinutes(referenceDate, Number(duration)), "HH:mm");
    } catch {
      return "--:--";
    }
  }, [startTime, duration]);

  const { mutate: saveSession, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      return sessionId
        ? api.patch(`/encounters/${sessionId}`, payload)
        : api.post("/encounters", payload);
    },
    onSuccess: () => {
      toast.success(
        sessionId ? "Registro atualizado!" : "Atendimento finalizado!",
      );
      queryClient.invalidateQueries({ queryKey: ["encounters"] });
      router.back();
    },
    onError: () => toast.error("Falha ao salvar."),
  });

  const handleComplete = () => {
    if (isLocked)
      return toast.error("Desative o modo visualização para salvar.");
    if (!selectedPatient) return toast.error("Selecione um paciente.");

    saveSession({
      patientId: selectedPatient,
      content: editor?.getHTML(),
      startAt: new Date().toISOString(),
      durationInMinutes: Number(duration),
      billingType: insurance === "cauzzo" ? "SUBSIDIZED" : "PRIVATE",
      status: "completed",
    });
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20 px-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-5 border-b border-border/20">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight italic">
              {sessionId ? "Prontuário Digital" : "Novo Atendimento"}
            </h1>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">
              {sessionId ? "Histórico de Evolução" : "Evolução Clínica"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLocked(!isLocked)}
            className={cn(
              "rounded-lg border-2 gap-2 font-bold uppercase tracking-widest text-xs h-12 px-4 transition-all",
              isLocked
                ? "border-border text-muted-foreground hover:bg-accent"
                : "border-secondary/50 text-secondary bg-secondary/5",
            )}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" /> Modo Visualização
              </>
            ) : (
              <>
                <LockOpen className="w-3.5 h-3.5" /> Modo Edição
              </>
            )}
          </Button>

          <Button
            onClick={handleComplete}
            disabled={isPending || isLoadingSession || isLocked}
            className="bg-secondary text-secondary-foreground px-10 h-12 rounded-xl font-bold shadow-lg disabled:opacity-30 transition-all"
          >
            {isPending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Finalizar
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside
          className={cn(
            "lg:col-span-3 sticky top-[160px] space-y-6",
            isLocked && "opacity-60 pointer-events-none",
          )}
        >
          <div className="space-y-6 p-8 rounded-3xl border border-border/40 bg-card/50 shadow-sm">
            <div className="space-y-3">
              <Label className="text-xs uppercase font-black text-muted-foreground tracking-widest italic text-secondary">
                Paciente Vinculado
              </Label>
              <PatientSelector
                selectedId={selectedPatient}
                onSelect={setSelectedPatient}
              />
            </div>

            <div className="space-y-4 border-t border-border/20 pt-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary" />{" "}
                  Convênio
                </Label>
                <Select value={insurance} onValueChange={setInsurance}>
                  <SelectTrigger className="h-12 rounded-xl bg-background border-border/40 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground font-bold">
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="cauzzo">Cauzzo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <Clock8 className="h-3.5 w-3.5 text-secondary" /> Início (24h)
                </Label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-background border border-border/40 font-mono text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <Timer className="h-3.5 w-3.5 text-secondary" /> Duração
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-12 rounded-xl bg-background border-border/40 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground font-bold">
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="50">50 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 group transition-all">
                <p className="text-sm uppercase font-black text-muted-foreground tracking-widest">
                  Previsão de Término
                </p>
                <p className="text-xl font-mono font-black text-secondary tracking-tighter">
                  {endTime}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-muted-foreground flex items-center gap-2">
                  <Banknote className="h-3.5 w-3.5 text-secondary" /> Valor da
                  Sessão
                </Label>
                <NumericFormat
                  customInput={(props) => (
                    <input
                      {...props}
                      className="w-full h-12 px-4 rounded-xl bg-background border border-border/40 font-bold text-sm outline-none focus:ring-2 focus:ring-secondary/20"
                    />
                  )}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  value={sessionValue}
                  onValueChange={(v) => setSessionValue(v.value)}
                  isAllowed={(values) =>
                    values.floatValue === undefined || values.floatValue <= 1000
                  }
                />
                <p className="text-xs text-muted-foreground italic leading-tight ml-1">
                  Limite: R$ 1,00 a R$ 1.000,00
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/10 flex gap-4 items-center">
            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
            <span className="text-xs text-muted-foreground font-black uppercase tracking-wider">
              Draft Auto-save
            </span>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-4">
          {!isLocked && <EditorMenuBar editor={editor} />}
          <div className={cn("relative transition-all", isLocked && "mt-0")}>
            <EditorContent editor={editor} />
            {isLocked && (
              <div
                className="absolute inset-0 z-10 cursor-not-allowed"
                title="Modo visualização ativado"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EncounterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Carregando atendimento...</div>}>
      <EncounterPageContent />
    </Suspense>
  );
}
