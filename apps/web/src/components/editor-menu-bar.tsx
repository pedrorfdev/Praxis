"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo,
  Redo,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

const wordColors = [
  { name: "Preto", color: "#000000" },
  { name: "Vermelho", color: "#e11d48" },
  { name: "Azul", color: "#2563eb" },
  { name: "Verde", color: "#16a34a" },
  { name: "Laranja", color: "#ea580c" },
  { name: "Roxo", color: "#9333ea" },
];

export const EditorMenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle").color || "#000000";

  const toggleAction = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-secondary/5 border border-border/40 rounded-t-3xl border-b-0 sticky top-[73px] z-10 backdrop-blur-sm">
      <div className="flex items-center gap-1 bg-background p-1 rounded-xl shadow-inner border border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() =>
            editor.chain().focus().toggleBold().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold") && "bg-secondary/15 text-secondary",
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() =>
            editor.chain().focus().toggleItalic().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-secondary/15 text-secondary",
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <Palette className="h-4 w-4" />
              <div
                className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full border border-background shadow-xs"
                style={{ backgroundColor: currentColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3 space-y-3" align="start">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
              Paleta Padrão
            </Label>
            <div className="grid grid-cols-5 gap-1.5">
              {wordColors.map((c) => (
                <button
                  key={c.color}
                  onClick={() => editor.chain().focus().setColor(c.color).run()}
                  className="h-7 w-7 rounded-md border border-border/40 transition-transform hover:scale-110 shadow-sm"
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>

            <Separator className="bg-border/40" />

            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Cor Personalizada
              </Label>

              <div className="flex items-center gap-3">
                {/* O QUADRADO BONITO (Falso Input) */}
                <div className="relative group cursor-pointer">
                  <div
                    className="h-10 w-10 rounded-xl border-2 border-background shadow-lg ring-1 ring-border/50 transition-transform group-hover:scale-110 active:scale-95"
                    style={{ backgroundColor: currentColor }}
                  />

                  {/* O INPUT REAL (Invisível mas clicável) */}
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) =>
                      editor.chain().focus().setColor(e.target.value).run()
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* EXIBIÇÃO DO HEXADECIMAL */}
                <div className="flex-1 flex flex-col justify-center px-4 h-10 bg-secondary/5 rounded-xl border border-border/40">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none mb-1">
                    Hex Code
                  </span>
                  <span className="text-xs font-mono font-black text-primary uppercase tracking-tighter">
                    {currentColor}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-[10px] uppercase font-bold"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              Remover Cor
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6 bg-border/40" />

      <div className="flex items-center gap-1 bg-background p-1 rounded-xl shadow-inner border border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 1 }) &&
              "bg-secondary/15 text-secondary",
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() =>
            editor.chain().focus().toggleBulletList().run(),
          )}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-secondary/15 text-secondary",
          )}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 ml-auto bg-background p-1 rounded-xl shadow-inner border border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() => editor.chain().focus().undo().run())}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAction(() => editor.chain().focus().redo().run())}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
