"use client";

import { Moon, Sun, ChevronRight } from "lucide-react";
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
import { NewPatientDialog } from "./patients/new-patient-dialog";
import Link from "next/link";

const routeMap: Record<string, string> = {
  agenda: "Agenda",
  pacientes: "Pacientes",
  prontuarios: "Prontuários",
  settings: "Configurações",
};

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
              pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                const label = routeMap[segment] || segment;

                return (
                  <div key={href} className="flex items-center gap-2">
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
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4">
      {/*   {pathname.includes('/pacientes') ? (
           <NewPatientDialog />
        ) : pathname.includes('/agenda') ? (
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold shadow-lg shadow-secondary/10">
            Novo Atendimento
          </Button>
        ) : null} */}
        
        <Separator orientation="vertical" className="h-6 opacity-40" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-secondary/10 rounded-xl transition-colors">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
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