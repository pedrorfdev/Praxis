"use client";

import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from 'react'

const patientsMock = [
  { id: "1", name: "João Silva", diagnostic: "ASD" },
  { id: "2", name: "Maria Oliveira", diagnostic: "ADHD" },
  { id: "3", name: "Pedro Santos", diagnostic: "Anxiety" },
];

interface PatientSelectorProps {
  onSelect: (id: string) => void;
  selectedId: string | null;
}

export function PatientSelector({ onSelect, selectedId }: PatientSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedPatient = patientsMock.find((p) => p.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full h-14 justify-between rounded-2xl border-2 border-dashed border-border/60 hover:border-secondary/40 hover:bg-secondary/5 transition-all"
        >
          {selectedPatient ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-black text-secondary">
                {selectedPatient.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-none">{selectedPatient.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-tighter">
                  {selectedPatient.diagnostic}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground font-medium text-sm">Escolha um paciente...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-border/40" align="start">
        <Command className="rounded-2xl">
          <CommandInput placeholder="Search patient name..." className="h-12" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center">
              <p className="text-xs text-muted-foreground">Nenhum paciente encontrado.</p>
              <Button variant="ghost" size="sm" className="mt-2 text-secondary font-bold text-[10px] uppercase">
                <UserPlus className="h-3 w-3 mr-2" /> Criar novo paciente
              </Button>
            </CommandEmpty>
            <CommandGroup heading="Recent Patients">
              {patientsMock.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={patient.name}
                  onSelect={() => {
                    onSelect(patient.id);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold",
                      selectedId === patient.id ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {patient.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{patient.name}</p>
                      <p className="text-[10px] text-muted-foreground">{patient.diagnostic}</p>
                    </div>
                  </div>
                  <Check className={cn("h-4 w-4 text-secondary", selectedId === patient.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}