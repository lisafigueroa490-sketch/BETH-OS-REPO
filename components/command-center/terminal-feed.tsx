"use client"

import { useState, useEffect, useRef } from "react"
import { Terminal, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LogEntry {
  id: number
  timestamp: string
  type: "info" | "success" | "warning" | "error" | "system"
  message: string
}

const logMessages = [
  { type: "system" as const, message: "XRM_CORE initialized successfully" },
  { type: "info" as const, message: "Scanning sector ALPHA-7 for data anomalies..." },
  { type: "success" as const, message: "Target TGT-042 acquired | Value: 847.23" },
  { type: "info" as const, message: "BETA_SCANNER efficiency optimized to 94.2%" },
  { type: "warning" as const, message: "Network latency spike detected: 142ms" },
  { type: "success" as const, message: "Profit margin increased +2.4% | Total: $127,842.56" },
  { type: "info" as const, message: "Executing ALPHA_HUNTER algorithm cycle #12847" },
  { type: "system" as const, message: "Memory optimization complete | Freed: 128MB" },
  { type: "success" as const, message: "Data pipeline synchronized with MARKET_D" },
  { type: "warning" as const, message: "Algorithm GAMMA_TRACKER paused for recalibration" },
  { type: "info" as const, message: "New data stream detected in sector EPSILON" },
  { type: "success" as const, message: "Target TGT-089 validated | Priority: CRITICAL" },
  { type: "error" as const, message: "Connection timeout to NODE_7 | Retrying..." },
  { type: "success" as const, message: "NODE_7 reconnected successfully" },
  { type: "info" as const, message: "Processing batch #4892 from DELTA sector" },
]

export function TerminalFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const logIdRef = useRef(0)

  const formatTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  useEffect(() => {
    // Initial logs
    const initialLogs = logMessages.slice(0, 5).map((log, i) => ({
      id: i,
      timestamp: formatTimestamp(),
      ...log,
    }))
    setLogs(initialLogs)
    logIdRef.current = 5

    // Add new logs periodically
    const interval = setInterval(() => {
      const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)]
      const newLog: LogEntry = {
        id: logIdRef.current++,
        timestamp: formatTimestamp(),
        ...randomLog,
      }
      setLogs((prev) => [...prev.slice(-19), newLog])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "text-primary"
      case "warning": return "text-chart-4"
      case "error": return "text-destructive"
      case "system": return "text-chart-2"
      default: return "text-muted-foreground"
    }
  }

  const getTypePrefix = (type: string) => {
    switch (type) {
      case "success": return "[OK]"
      case "warning": return "[WARN]"
      case "error": return "[ERR]"
      case "system": return "[SYS]"
      default: return "[INFO]"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-foreground">TERMINAL_FEED</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground">LIVE</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={scrollRef}
          className="h-48 md:h-64 overflow-y-auto bg-background/50 rounded border border-border p-3 space-y-1 font-mono text-xs"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
              <ChevronRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
              <span className={`shrink-0 ${getTypeColor(log.type)}`}>{getTypePrefix(log.type)}</span>
              <span className="text-foreground break-all">{log.message}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-primary">
            <ChevronRight className="w-3 h-3" />
            <span className="animate-blink">_</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
