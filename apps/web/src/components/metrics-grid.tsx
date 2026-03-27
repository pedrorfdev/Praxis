import { Users, CalendarCheck, Clock, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  {
    title: "Sessões Hoje",
    value: "8",
    description: "4 finalizadas",
    icon: CalendarCheck,
    color: "text-secondary",
  },
  {
    title: "Pacientes Ativos",
    value: "24",
    description: "+2 este mês",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Evoluções Pendentes",
    value: "3",
    description: "Prontuários para fechar",
    icon: FileText,
    color: "text-destructive",
  },
  {
    title: "Horas de Terapia",
    value: "32h",
    description: "Total na semana",
    icon: Clock,
    color: "text-muted-foreground",
  },
]

export function MetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((item) => (
        <Card key={item.title} className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}