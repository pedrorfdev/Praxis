"use client";

import { useState } from "react";
import { ChevronDown, User, Phone, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export function PatientMiniHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 mb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary text-xs border border-secondary/20">
            JS
          </div>
          <div>
            <h2 className="text-sm font-bold text-primary leading-none">João Silva</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">TEA • 6 anos</p>
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-secondary/5 transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground"
        >
          {isOpen ? "Recolher Info" : "Consultar Ficha"}
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </div>

      <div className={cn(
        "overflow-hidden transition-all duration-500 ease-in-out bg-card/50",
        isOpen ? "max-h-[200px] border-t border-border/20" : "max-h-0"
      )}>
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-8">
           <div className="flex items-center gap-3">
             <User className="h-4 w-4 text-secondary" />
             <div>
               <p className="text-[9px] text-muted-foreground uppercase font-black">Responsável</p>
               <p className="text-xs font-bold">Maria Silva (Mãe)</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <Phone className="h-4 w-4 text-secondary" />
             <div>
               <p className="text-[9px] text-muted-foreground uppercase font-black">Contato</p>
               <p className="text-xs font-bold">(51) 99887-6655</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <ClipboardList className="h-4 w-4 text-secondary" />
             <div>
               <p className="text-[9px] text-muted-foreground uppercase font-black">CPF</p>
               <p className="text-xs font-bold">123.456.789-00</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}