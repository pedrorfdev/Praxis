"use client";

import { usePathname } from "next/navigation";
import {
  Users,
  ClipboardList,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Pacientes", url: "/patients", icon: Users },
  { title: "Prontuários", url: "/activity", icon: ClipboardList },
  { title: "Responsáveis", url: "/caregivers", icon: Users },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-6">
        <Link href="/" className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground font-black shadow-lg shadow-primary/20">
            <img src="/praxis-logo.svg" alt="Praxis Logo" className="h-full w-full object-contain" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight text-primary group-data-[collapsible=icon]:hidden">
            Praxis
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest font-bold opacity-50">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "bg-secondary/15 text-secondary font-semibold"
                          : "hover:bg-secondary/10 hover:text-secondary/80"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={isActive ? "text-secondary" : ""}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
