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

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listPatients, linkPatientToCaregiver } from "@/services/frontend-data";
import { toast } from "sonner";

export function LinkPatientDialog({ caregiverId }: { caregiverId: string }) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
  });

  const mutation = useMutation({
    mutationFn: () => linkPatientToCaregiver(caregiverId, selectedId),
    onSuccess: () => {
      toast.success("Paciente vinculado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["caregiver", caregiverId] });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao vincular paciente:", error);
      toast.error("Erro ao vincular paciente. Tente novamente.");
    }
  });

  const handleLink = () => {
    if (!selectedId) return;
    mutation.mutate();
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
          <Command className="rounded-lg border border-border/40 bg-card" value={selectedId} onValueChange={setSelectedId}>
            <CommandInput placeholder="Buscar paciente..." className="border-0 focus-visible:ring-0" />
            <CommandList>
              <CommandEmpty className="text-muted-foreground text-sm py-6 text-center">Nenhum paciente encontrado.</CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/10 transition-all rounded-lg mx-1 my-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{patient.fullName}</span>
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
            disabled={!selectedId || mutation.isPending}
            className="bg-secondary text-secondary-foreground font-bold px-6 rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Vinculando..." : "Confirmar Vínculo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}