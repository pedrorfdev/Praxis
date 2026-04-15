"use client";

import { Editor } from "@tiptap/react";
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2,
  Quote, Undo, Redo, Palette, Type, Baseline
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useCallback } from "react";

const colors = [
  { name: "Preto", color: "#000000" },
  { name: "Vermelho", color: "#e11d48" },
  { name: "Azul", color: "#2563eb" },
  { name: "Verde", color: "#16a34a" },
  { name: "Laranja", color: "#ea580c" },
  { name: "Roxo", color: "#9333ea" },
];

export const EditorMenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  
  const [activeSize, setActiveSize] = useState("16px");

  // Atualiza o label do tamanho da fonte baseado na seleção atual
  const updateLabel = useCallback(() => {
    const attrs = editor.getAttributes("textStyle");
    setActiveSize(attrs.fontSize || "16px");
  }, [editor]);

  useEffect(() => {
    editor.on("selectionUpdate", updateLabel);
    editor.on("transaction", updateLabel);
    return () => {
      editor.off("selectionUpdate", updateLabel);
      editor.off("transaction", updateLabel);
    };
  }, [editor, updateLabel]);

  const currentColor = editor.getAttributes("textStyle").color || "#000000";

  const toggleAction = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-900/50 border border-white/5 rounded-t-3xl border-b-0 sticky top-[73px] z-10 backdrop-blur-sm">
      
      {/* SELETOR DE TAMANHO DE FONTE */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5 shadow-inner">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 min-w-[85px] justify-between px-3 hover:bg-white/5 text-secondary"
            >
              <span className="text-[11px] font-black font-mono">
                {activeSize}
              </span>
              <Type className="h-3 w-3 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[120px] p-1 bg-zinc-950 border-white/10 shadow-2xl z-[60]" align="start">
            <div className="flex flex-col gap-0.5">
              {["12px", "14px", "16px", "18px", "20px", "24px", "32px"].map((size) => (
                <Button
                  key={size}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 justify-start font-mono text-xs text-zinc-400 hover:text-white hover:bg-white/5",
                    activeSize === size && "bg-secondary/20 text-secondary font-black"
                  )}
                  onClick={() => {
                    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
                    setActiveSize(size);
                  }}
                >
                  {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/5" />

      {/* ESTILOS BÁSICOS */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5 shadow-inner">
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleBold().run())}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-secondary/15 text-secondary")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleItalic().run())}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-secondary/15 text-secondary")}
        >
          <Italic className="h-4 w-4" />
        </Button>

        {/* COR DO TEXTO */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Baseline className="h-4 w-4" />
              <div
                className="absolute bottom-1 right-1 h-1 w-3 rounded-full border border-zinc-950"
                style={{ backgroundColor: currentColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3 space-y-3 bg-zinc-950 border-white/10" align="start">
            <Label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Cores de Destaque</Label>
            <div className="grid grid-cols-5 gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.color}
                  onClick={() => editor.chain().focus().setColor(c.color).run()}
                  className="h-7 w-7 rounded-lg border border-white/10 transition-transform hover:scale-110"
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
            <Button
              variant="outline" size="sm"
              className="w-full h-8 text-[10px] uppercase font-black border-white/5 hover:bg-white/5"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Resetar Cor
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/5" />

      {/* BLOCOS E LISTAS */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5 shadow-inner">
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-secondary/15 text-secondary")}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleBulletList().run())}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-secondary/15 text-secondary")}
        >
          <List className="h-4 w-4" />
        </Button>

        {/* LISTA ORDENADA - ADICIONADO */}
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleOrderedList().run())}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-secondary/15 text-secondary")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        {/* CITAÇÃO / QUOTE - ADICIONADO */}
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().toggleBlockquote().run())}
          className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-secondary/15 text-secondary")}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* UNDO / REDO */}
      <div className="flex items-center gap-1 ml-auto bg-zinc-950 p-1 rounded-xl border border-white/5 shadow-inner">
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().undo().run())}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 opacity-50 disabled:opacity-20"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" size="sm"
          onClick={toggleAction(() => editor.chain().focus().redo().run())}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 opacity-50 disabled:opacity-20"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};