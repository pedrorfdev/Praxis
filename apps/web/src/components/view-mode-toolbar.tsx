"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ViewMode = "grid" | "list";

type ViewModeToolbarProps = {
  search: string;
  view: ViewMode;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onViewChange: (value: ViewMode) => void;
};

export function ViewModeToolbar({
  search,
  view,
  searchPlaceholder,
  onSearchChange,
  onViewChange,
}: ViewModeToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-secondary/5 p-2 rounded-2xl border border-border/40">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10 bg-background border-none shadow-none focus-visible:ring-1 focus-visible:ring-secondary/50"
        />
      </div>

      <Tabs value={view} onValueChange={(value) => onViewChange(value as ViewMode)} className="w-fit">
        <TabsList className="bg-background border border-border/50">
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="h-4 w-4" /> Cards
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" /> Lista
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
