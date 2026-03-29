"use client"

import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AgendaPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <aside className="xl:col-span-4 space-y-6">
        <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-sm flex justify-center">
          <Calendar 
            mode="single"
            className="rounded-md"
          />
        </div>

        <div className="rounded-3xl border border-border/40 bg-secondary/5 p-6">
          <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-secondary" />
            Resumo do Dia
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total de sessões:</span>
              <span className="font-bold text-primary">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horas clínicas:</span>
              <span className="font-bold text-primary">6h 40min</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="xl:col-span-8 space-y-6">
        <div className="flex items-center justify-between bg-card border border-border/40 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><ChevronLeft /></Button>
            <h2 className="text-lg font-bold text-primary">Segunda-feira, 30 de Março</h2>
            <Button variant="ghost" size="icon"><ChevronRight /></Button>
          </div>
          <Badge variant="outline" className="border-secondary text-secondary font-bold">Hoje</Badge>
        </div>

        <div className="space-y-4">
          {[
            { time: "08:00", name: "Lucas Rocha", type: "Avaliação", status: "completed" },
            { time: "09:00", name: "Beatriz M.", type: "Terapia Ocupacional", status: "next" },
            { time: "10:00", name: "Vago", type: "-", status: "empty" },
          ].map((slot, i) => (
            <div key={i} className={`flex items-center gap-6 p-4 rounded-2xl border transition-all ${
              slot.status === 'next' ? 'bg-secondary/10 border-secondary/40 shadow-md scale-[1.02]' : 'bg-card border-border/40 opacity-70'
            }`}>
              <span className="text-sm font-bold text-muted-foreground min-w-[50px]">{slot.time}</span>
              <div className="flex-1">
                <h4 className={`font-bold ${slot.status === 'empty' ? 'text-muted-foreground/50' : 'text-primary'}`}>
                  {slot.name}
                </h4>
                <p className="text-xs text-muted-foreground">{slot.type}</p>
              </div>
              {slot.status === 'next' && (
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold">
                  Iniciar Sessão
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}