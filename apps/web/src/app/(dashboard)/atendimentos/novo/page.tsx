"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle2, Loader2, Info } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EditorMenuBar } from "@/components/editor-menu-bar";
import { PatientSelector } from "@/components/patients-selector";

export default function NewSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const patientIdFromUrl = searchParams.get("patientId");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(
    patientIdFromUrl,
  );
  const STORAGE_KEY = `praxis-draft-${selectedPatient || "new-session"}`;

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Comece a descrever a evolução...",
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate prose-xl focus:outline-none min-h-[650px] max-w-full p-12 rounded-b-3xl border border-border/40 shadow-inner bg-card text-foreground/90 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      localStorage.setItem(STORAGE_KEY, editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && !editor.getText()) {
        editor.commands.setContent(saved);
        toast.info("Draft recovered automatically.");
      }
    }
  }, [editor, STORAGE_KEY]);

  const { mutate: saveSession, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/sessions", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Atendimento salvo com sucesso!");
      localStorage.removeItem(STORAGE_KEY);
      queryClient.invalidateQueries({
        queryKey: ["sessions", selectedPatient],
      });
      router.back();
    },
    onError: () => toast.error("Erro ao tentar salvar o atendimento."),
  });

  const handleComplete = () => {
    if (!selectedPatient) return toast.error("Please select a patient first.");
    const content = editor?.getHTML();
    if (!content || content === "<p></p>")
      return toast.error("O conteúdo não pode ser vazio.");

    saveSession({
      patientId: selectedPatient,
      content,
      startedAt: new Date().toISOString(),
      durationInMinutes: 60,
      billingType: "PRIVATE",
      status: "completed",
    });
  };

  if (!editor) return null;

  return (
    <div className="w-full mx-auto space-y-6 pb-20 px-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-5 border-b border-border/20">
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
            <h1 className="text-2xl font-bold text-primary tracking-tight italic">
              Atendimento Clínico
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              Evolução do Prontuário
            </p>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          disabled={isPending}
          className="bg-secondary text-secondary-foreground px-10 h-12 rounded-xl font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Finalizar Atendimento
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="lg:col-span-3 sticky top-[160px] space-y-6">
          <div className="space-y-6 p-8 rounded-3xl border border-border/40 bg-card/50 shadow-sm">
            <div className="space-y-3">
              <Label className="text-[11px] uppercase font-black text-muted-foreground tracking-widest italic">
                Identificação do Paciente
              </Label>

              <PatientSelector
                selectedId={selectedPatient}
                onSelect={(id) => setSelectedPatient(id)}
              />

              {selectedPatient && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] text-secondary font-bold uppercase">
                    Vinculado ao atendimento
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-muted-foreground tracking-widest">
                  Duração
                </Label>
                <Select defaultValue="60">
                  <SelectTrigger className="h-12 rounded-xl bg-background border-border/40 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] uppercase font-black text-muted-foreground tracking-widest">
                  Tipo de Cobrança
                </Label>
                <Select defaultValue="PRIVATE">
                  <SelectTrigger className="h-12 rounded-xl bg-background border-border/40 font-medium text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRIVATE">Particular</SelectItem>
                    <SelectItem value="INSURANCE">Convênio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-secondary/5 border border-secondary/10 flex gap-4 items-center">
            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider leading-tight">
              Rascunho salvo automaticamente
            </span>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-4">
          <EditorMenuBar editor={editor} />
          <EditorContent editor={editor} />

          <div className="flex items-center gap-2 px-2 py-4 text-muted-foreground/60 border-t border-border/10">
            <Info className="h-4 w-4" />
            <span className="text-[10px] font-medium italic">
              Pro-tip: Todos os atendimentos são armazenados localmente para prevenir perda de dados até o fim do atendimento.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
