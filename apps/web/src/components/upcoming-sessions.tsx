import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sessions = [
  { name: "João Silva", time: "14:00", type: "TEA", status: "Confirmado" },
  { name: "Maria Oliveira", time: "15:00", type: "TDAH", status: "Confirmado" },
  { name: "Pedro Santos", time: "16:30", type: "Coordenação Motora", status: "Pendente" },
]

export function UpcomingSessions() {
  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <div key={session.time} className="flex items-center gap-4">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {session.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <p className="text-sm font-medium leading-none">{session.name}</p>
            <p className="text-xs text-muted-foreground">{session.type}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{session.time}</p>
            <p className={`text-[10px] ${session.status === 'Confirmado' ? 'text-secondary' : 'text-amber-500'}`}>
              {session.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}