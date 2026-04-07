"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TimelineFilters() {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Pesquisar em evoluções (ex: comportamento, motricidade...)" 
          className="w-full pl-11 h-12 bg-card/50 border-border/20 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all text-sm font-medium"
        />
      </div>
    </div>
  );
}