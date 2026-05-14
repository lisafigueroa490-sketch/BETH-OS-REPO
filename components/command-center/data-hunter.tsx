"use client"

import { useState, useEffect } from "react"
import { Search, Crosshair, Target, Radar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

interface DataTarget {
  id: string
  sector: string
  value: number
  priority: "critical" | "high" | "medium" | "low"
  status: "acquired" | "tracking" | "scanning"
}

const generateTargets = (): DataTarget[] => [
  { id: "TGT-001", sector: "ALPHA", value: 847, priority: "critical", status: "tracking" },
  { id: "TGT-002", sector: "BETA", value: 623, priority: "high", status: "acquired" },
  { id: "TGT-003", sector: "GAMMA", value: 412, priority: "medium", status: "scanning" },
  { id: "TGT-004", sector: "DELTA", value: 298, priority: "high", status: "tracking" },
  { id: "TGT-005", sector: "EPSILON", value: 567, priority: "critical", status: "acquired" },
  { id: "TGT-006", sector: "ZETA", value: 189, priority: "low", status: "scanning" },
]

export function DataHunter() {
  const [targets, setTargets] = useState<DataTarget[]>(generateTargets)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev + 1) % 100)
      setTargets((prev) =>
        prev.map((target) => ({
          ...target,
          value: Math.max(0, target.value + Math.floor((Math.random() - 0.5) * 50)),
        }))
      )
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const chartData = targets.map((t) => ({
    sector: t.sector,
    value: t.value,
    priority: t.priority,
  }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "oklch(0.65 0.25 25)"
      case "high": return "oklch(0.8 0.15 80)"
      case "medium": return "oklch(0.7 0.15 200)"
      default: return "oklch(0.6 0 0)"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "acquired": return "bg-primary/20 text-primary border-primary/50"
      case "tracking": return "bg-chart-4/20 text-chart-4 border-chart-4/50"
      default: return "bg-chart-2/20 text-chart-2 border-chart-2/50"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" />
            <span className="text-foreground">DATA_HUNTER</span>
          </div>
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-xs text-muted-foreground">SCAN: {scanProgress}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sector Chart */}
        <div className="h-32 md:h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="sector"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.005 240)",
                  border: "1px solid oklch(0.22 0.01 240)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "oklch(0.95 0 0)",
                }}
                formatter={(value: number) => [value, "Value"]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getPriorityColor(entry.priority)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Target List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {targets.slice(0, 4).map((target) => (
            <div
              key={target.id}
              className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-border"
            >
              <div className="flex items-center gap-3">
                <Target className="w-3 h-3 text-primary" />
                <div>
                  <p className="text-xs font-mono text-foreground">{target.id}</p>
                  <p className="text-[10px] text-muted-foreground">SECTOR: {target.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-foreground tabular-nums">{target.value}</span>
                <Badge variant="outline" className={`text-[10px] ${getStatusBadge(target.status)}`}>
                  {target.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-2">
          <span className="flex items-center gap-1">
            <Search className="w-3 h-3" />
            {targets.filter((t) => t.status === "acquired").length} ACQUIRED
          </span>
          <span>{targets.filter((t) => t.status === "tracking").length} TRACKING</span>
          <span>{targets.filter((t) => t.status === "scanning").length} SCANNING</span>
        </div>
      </CardContent>
    </Card>
  )
}
