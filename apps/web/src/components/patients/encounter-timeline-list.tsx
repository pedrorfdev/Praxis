"use client";

import { MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { listEncounters } from "@/services/frontend-data";

interface EncounterTimelineListProps {
  limit?: number;
}

export function EncounterTimelineList({ limit }: EncounterTimelineListProps) {
  const router = useRouter();
  const { data: encounters = [] } = useQuery({
    queryKey: ["encounters-timeline"],
    queryFn: listEncounters,
  });

  const displayedEncounters = limit ? encounters.slice(0, limit) : encounters;

  return (
    <div className="relative pl-8 sm:pl-12 space-y-10">
      {/* Linha vertical */}
      <div className="absolute left-[15px] sm:left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-secondary/40 via-secondary/15 to-transparent" />

      <div className="space-y-12">
        {displayedEncounters.map((encounter) => (
          <div
            key={encounter.id}
            className="relative group animate-in slide-in-from-left-4 duration-500"
          >
            {/* Bolinha da timeline */}
            <div className="absolute left-[-17px] sm:left-[-25px] top-7 -translate-x-1/2 flex items-center justify-center">
              <div className="relative h-5 w-5 rounded-full border-2 border-secondary/50 bg-background flex items-center justify-center group-hover:border-secondary transition-colors duration-300">
                <div className="h-2 w-2 rounded-full bg-secondary group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:border-secondary/40 hover:shadow-md transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-secondary/25 w-fit">
                    {encounter.date}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium italic mt-1 ml-1">
                    Duração: {encounter.duration}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-2xl shrink-0 hover:bg-secondary/10 hover:text-secondary text-muted-foreground transition-all"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-2xl p-2"
                  >
                    <DropdownMenuItem
                      onClick={() => router.push(`/encounters/new?id=${encounter.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group/item"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary group-hover/item:bg-secondary group-hover/item:text-secondary-foreground transition-all">
                        <Pencil className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold">Editar registro</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-[15px] sm:text-[16px] text-foreground leading-relaxed font-medium tracking-tight">
                {encounter.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}