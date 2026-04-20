"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const patientsMock = [
  { id: "p3", name: "Lucas Ferreira", diagnosis: "TDAH" },
  { id: "p4", name: "Beatriz Souza", diagnosis: "TEA" },
  { id: "p5", name: "Gabriel Lima", diagnosis: "TOD" },
];

export function LinkPatientDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");

  const handleLink = () => {
    if (!selectedId) return;
    console.log("Vinculando paciente ID:", selectedId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg border-2 border-secondary/30 gap-2 hover:bg-secondary/10 hover:border-secondary/50 cursor-pointer font-bold text-xs uppercase tracking-widest transition-all">
          <UserPlus className="h-4 w-4" /> Vincular Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-foreground">Vincular Paciente</DialogTitle>
          <DialogDescription className="text-muted-foreground italic">
            Busque pelo nome do paciente para associá-lo a este cuidador.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Command className="rounded-lg border border-border/40 bg-card">
            <CommandInput placeholder="Buscar paciente..." className="border-0 focus-visible:ring-0" />
            <CommandList>
              <CommandEmpty className="text-muted-foreground text-sm py-6 text-center">Nenhum paciente encontrado.</CommandEmpty>
              <CommandGroup>
                {patientsMock.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.name}
                    onSelect={() => setSelectedId(patient.id)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/10 transition-all rounded-lg mx-1 my-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{patient.name}</span>
                      <span className="text-xs text-muted-foreground">{patient.diagnosis}</span>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 text-secondary transition-opacity",
                        selectedId === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-lg hover:bg-secondary/10">
            Cancelar
          </Button>
          <Button 
            onClick={handleLink} 
            disabled={!selectedId}
            className="bg-secondary text-secondary-foreground font-bold px-6 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Vínculo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}