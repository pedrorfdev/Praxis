"use client"

import { User, Building, Shield, Camera, Mail, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ConfigPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Configurações
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerencie a identidade da sua clínica e preferências de segurança.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-secondary/5 border border-border/40 p-1 mb-10 h-12 rounded-2xl w-full sm:w-fit">
          <TabsTrigger value="profile" className="gap-2 rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="h-4 w-4" /> Perfil
          </TabsTrigger>
          <TabsTrigger value="clinic" className="gap-2 rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Building className="h-4 w-4" /> Clínica
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" /> Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-[32px] border border-border/40 bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-secondary/5 blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                  <div className="h-28 w-28 rounded-3xl bg-secondary/10 flex items-center justify-center border-2 border-secondary/20 group-hover:border-secondary transition-all overflow-hidden">
                    <User className="h-12 w-12 text-secondary/40 group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg border-4 border-background group-hover:bg-secondary transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Foto de Perfil</span>
              </div>

              <div className="flex-1 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-secondary/80 ml-1">Nome Profissional</label>
                    <Input defaultValue="Pedro Ferreira" className="rounded-2xl border-border/60 bg-secondary/5 focus-visible:ring-secondary/30 h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-secondary/80 ml-1">Registro (CREFITO/CRP)</label>
                    <Input placeholder="000000-F" className="rounded-2xl border-border/60 bg-secondary/5 focus-visible:ring-secondary/30 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-secondary/80 ml-1">E-mail de Acesso</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input defaultValue="pedro@praxis.com" className="rounded-2xl border-border/60 bg-secondary/5 pl-11 h-12" />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-border/40" />
                
                <div className="flex justify-end">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl px-10 h-12 font-bold shadow-lg shadow-secondary/20 transition-all active:scale-95">
                    Salvar Perfil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clinic" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-[32px] border border-border/40 bg-card p-8 md:p-10 space-y-10">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary italic">Identidade Visual</h3>
              <div className="flex items-center gap-8 p-6 rounded-2xl bg-secondary/5 border border-dashed border-secondary/20">
                <div className="h-24 w-40 rounded-xl bg-background flex flex-col items-center justify-center border border-border/40 text-muted-foreground gap-2">
                  <Building className="h-6 w-6 opacity-20" />
                  <span className="text-[10px] uppercase font-bold tracking-tighter">Preview Logo</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Logo da Clínica</p>
                  <p className="text-xs text-muted-foreground max-w-[200px]">Use uma imagem PNG com fundo transparente para relatórios.</p>
                  <Button variant="outline" size="sm" className="rounded-lg border-secondary/50 text-secondary text-[10px] font-bold uppercase tracking-wider h-8">Upload</Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-secondary/80 ml-1">Nome Fantasia da Clínica</label>
                <Input placeholder="Ex: Praxis Terapia Ocupacional" className="rounded-2xl h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-secondary/80 ml-1">Endereço de Atendimento</label>
                <Input placeholder="Rua, Número, Sala - Cidade/UF" className="rounded-2xl h-12" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-10 h-12 font-bold shadow-md transition-all active:scale-95">
                Atualizar Clínica
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}