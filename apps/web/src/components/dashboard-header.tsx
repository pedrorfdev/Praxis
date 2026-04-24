"use client";

import { Moon, Sun, ChevronRight, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/services/frontend-data";

const routeMap: Record<string, string> = {
  agenda: "Agenda",
  patients: "Pacientes",
  caregivers: "Cuidadores",
  prontuarios: "Prontuários",
  settings: "Configurações",
};

function BreadcrumbSegment({ segment, index, pathSegments }: { segment: string, index: number, pathSegments: string[] }) {
  const isLast = index === pathSegments.length - 1;
  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
  
  // UUID pattern check
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
  
  const { data: patient } = useQuery({
    queryKey: ["patient", segment],
    queryFn: () => getPatientById(segment),
    enabled: isUuid,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const label = isUuid ? (patient?.fullName || "Carregando...") : (routeMap[segment] || segment);

  return (
    <div className="flex items-center gap-2">
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage className="font-bold text-primary italic capitalize">
            {label}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href} className="capitalize">{label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      {!isLast && <BreadcrumbSeparator />}
    </div>
  );
}

export function DashboardHeader() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 bg-background/95 backdrop-blur transition-all">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer hover:bg-secondary/10" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/">Praxis</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            
            {pathSegments.length === 0 ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold text-primary italic">Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              pathSegments.map((segment, index) => (
                <BreadcrumbSegment 
                  key={segment + index} 
                  segment={segment} 
                  index={index} 
                  pathSegments={pathSegments} 
                />
              ))
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Separator orientation="vertical" className="h-6 opacity-40" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            localStorage.removeItem("praxis:token");
            window.location.href = "/login";
            toast.success("Sessão encerrada!");
          }}
          className="h-9 w-9 hover:bg-destructive/10 rounded-xl transition-colors group"
        >
          <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive transition-colors" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-secondary/10 rounded-xl transition-colors">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              <span className="sr-only">Alternar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-border/40">
            <DropdownMenuItem onClick={() => { setTheme("light"); toast.success("Modo Petroleum ativado!"); }}>
              Light (Petroleum)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("dark"); toast.success("Modo Onyx ativado"); }}>
              Dark (Onyx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme("system"); toast.success("Modo do sistema ativado!"); }}>
              Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}