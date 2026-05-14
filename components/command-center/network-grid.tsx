"use client"

import { useState, useEffect } from "react"
import { Network, Circle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Node {
  id: string
  name: string
  status: "active" | "idle" | "offline"
  ping: number
  load: number
}

const initialNodes: Node[] = [
  { id: "node-1", name: "NODE_ALPHA", status: "active", ping: 12, load: 78 },
  { id: "node-2", name: "NODE_BETA", status: "active", ping: 8, load: 65 },
  { id: "node-3", name: "NODE_GAMMA", status: "idle", ping: 24, load: 12 },
  { id: "node-4", name: "NODE_DELTA", status: "active", ping: 15, load: 89 },
  { id: "node-5", name: "NODE_EPSILON", status: "offline", ping: 0, load: 0 },
  { id: "node-6", name: "NODE_ZETA", status: "active", ping: 19, load: 54 },
]

export function NetworkGrid() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          ping: node.status !== "offline" ? Math.max(5, node.ping + Math.floor((Math.random() - 0.5) * 10)) : 0,
          load: node.status === "active" ? Math.min(100, Math.max(20, node.load + Math.floor((Math.random() - 0.5) * 15))) : node.load,
        }))
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-primary fill-primary"
      case "idle": return "text-chart-4 fill-chart-4"
      default: return "text-destructive fill-destructive"
    }
  }

  const getLoadColor = (load: number) => {
    if (load > 80) return "bg-destructive"
    if (load > 60) return "bg-chart-4"
    return "bg-primary"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-foreground">NETWORK_GRID</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {nodes.filter((n) => n.status === "active").length} ONLINE
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-2 rounded border ${
                node.status === "offline"
                  ? "bg-destructive/5 border-destructive/30"
                  : "bg-secondary/30 border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Circle className={`w-2 h-2 ${getStatusColor(node.status)}`} />
                  <span className="text-[10px] font-mono text-foreground truncate">{node.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>PING</span>
                  <span className={node.status === "offline" ? "text-destructive" : "text-foreground"}>
                    {node.status === "offline" ? "N/A" : `${node.ping}ms`}
                  </span>
                </div>
                {node.status !== "offline" && (
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getLoadColor(node.load)}`}
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Connection Lines Visual */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>TOTAL BANDWIDTH</span>
            <span className="text-foreground">847.2 Mbps</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span>PACKET LOSS</span>
            <span className="text-primary">0.02%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
