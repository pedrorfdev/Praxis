"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPatients } from "@/services/frontend-data";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5, hsl(200 60% 50%))",
  "var(--chart-6, hsl(270 60% 50%))",
];

export function SpecialtyChart() {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: listPatients,
  });

  // Agrupa por diagnóstico
  const diagnosisCounts = patients.reduce<Record<string, number>>((acc, p) => {
    const diagnosis = p.diagnosis || "Não informado";
    acc[diagnosis] = (acc[diagnosis] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(diagnosisCounts)
    .map(([name, value], index) => ({
      name,
      value,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="flex flex-col border-border/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Perfil de Atendimento</CardTitle>
        <CardDescription>Distribuição por diagnóstico</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
            Nenhum dado disponível
          </div>
        ) : (
          <>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                    formatter={(value, name) => {
                      const patientCount = Number(value ?? 0);
                      return [
                        `${patientCount} paciente${patientCount > 1 ? "s" : ""}`,
                        name ?? "",
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 py-4 text-xs">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
