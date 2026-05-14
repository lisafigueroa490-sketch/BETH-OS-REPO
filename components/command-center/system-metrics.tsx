"use client"

import { useState, useEffect } from "react"
import { Activity, Cpu, HardDrive, Thermometer, Gauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Metric {
  label: string
  value: number
  max: number
  unit: string
  icon: React.ReactNode
  color: string
}

export function SystemMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "CPU_LOAD", value: 67, max: 100, unit: "%", icon: <Cpu className="w-4 h-4" />, color: "text-primary" },
    { label: "MEMORY", value: 847, max: 2048, unit: "MB", icon: <HardDrive className="w-4 h-4" />, color: "text-chart-2" },
    { label: "NETWORK", value: 142, max: 1000, unit: "Mbps", icon: <Activity className="w-4 h-4" />, color: "text-chart-4" },
    { label: "TEMP", value: 62, max: 100, unit: "°C", icon: <Thermometer className="w-4 h-4" />, color: "text-chart-5" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.min(
            metric.max * 0.95,
            Math.max(metric.max * 0.2, metric.value + (Math.random() - 0.5) * metric.max * 0.1)
          ),
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getProgressColor = (value: number, max: number) => {
    const percent = (value / max) * 100
    if (percent > 85) return "bg-destructive"
    if (percent > 70) return "bg-chart-4"
    return "bg-primary"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-mono">
          <Gauge className="w-4 h-4 text-primary" />
          <span className="text-foreground">SYSTEM_METRICS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={metric.color}>{metric.icon}</span>
                <span className="text-xs font-mono text-muted-foreground">{metric.label}</span>
              </div>
              <span className="text-xs font-mono text-foreground tabular-nums">
                {metric.value.toFixed(0)}{metric.unit}
              </span>
            </div>
            <Progress
              value={(metric.value / metric.max) * 100}
              className="h-2 bg-secondary"
            />
          </div>
        ))}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="text-center p-2 bg-secondary/30 rounded">
            <p className="text-lg font-bold text-primary tabular-nums">4</p>
            <p className="text-[10px] text-muted-foreground">ACTIVE_NODES</p>
          </div>
          <div className="text-center p-2 bg-secondary/30 rounded">
            <p className="text-lg font-bold text-foreground tabular-nums">99.8%</p>
            <p className="text-[10px] text-muted-foreground">UPTIME</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
