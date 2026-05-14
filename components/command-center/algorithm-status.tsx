"use client"

import { useState, useEffect } from "react"
import { Cpu, Play, Pause, Zap, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Algorithm {
  id: string
  name: string
  status: "running" | "paused" | "idle"
  efficiency: number
  cycles: number
  target: string
}

const initialAlgorithms: Algorithm[] = [
  { id: "alg-001", name: "ALPHA_HUNTER", status: "running", efficiency: 94, cycles: 12847, target: "MARKET_A" },
  { id: "alg-002", name: "BETA_SCANNER", status: "running", efficiency: 87, cycles: 8421, target: "MARKET_B" },
  { id: "alg-003", name: "GAMMA_TRACKER", status: "paused", efficiency: 76, cycles: 4892, target: "MARKET_C" },
  { id: "alg-004", name: "DELTA_MINER", status: "running", efficiency: 91, cycles: 21047, target: "MARKET_D" },
]

export function AlgorithmStatus() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(initialAlgorithms)

  useEffect(() => {
    const interval = setInterval(() => {
      setAlgorithms((prev) =>
        prev.map((alg) => ({
          ...alg,
          efficiency: alg.status === "running" 
            ? Math.min(100, Math.max(60, alg.efficiency + (Math.random() - 0.5) * 5))
            : alg.efficiency,
          cycles: alg.status === "running" ? alg.cycles + Math.floor(Math.random() * 10) : alg.cycles,
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleStatus = (id: string) => {
    setAlgorithms((prev) =>
      prev.map((alg) =>
        alg.id === id
          ? { ...alg, status: alg.status === "running" ? "paused" : "running" }
          : alg
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-primary/20 text-primary border-primary/50"
      case "paused": return "bg-chart-4/20 text-chart-4 border-chart-4/50"
      default: return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-foreground">ALGORITHM_STATUS</span>
          </div>
          <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">
            {algorithms.filter((a) => a.status === "running").length}/{algorithms.length} ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {algorithms.map((alg) => (
          <div
            key={alg.id}
            className="p-3 bg-secondary/50 rounded-lg border border-border space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={`w-3 h-3 ${alg.status === "running" ? "text-primary animate-pulse-glow" : "text-muted-foreground"}`} />
                <span className="text-xs font-mono text-foreground">{alg.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-[10px] ${getStatusColor(alg.status)}`}>
                  {alg.status.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/20"
                  onClick={() => toggleStatus(alg.id)}
                >
                  {alg.status === "running" ? (
                    <Pause className="w-3 h-3 text-chart-4" />
                  ) : (
                    <Play className="w-3 h-3 text-primary" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>EFFICIENCY</span>
                <span className="text-foreground">{alg.efficiency.toFixed(1)}%</span>
              </div>
              <Progress value={alg.efficiency} className="h-1 bg-secondary" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>TARGET: {alg.target}</span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                {alg.cycles.toLocaleString()} cycles
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
