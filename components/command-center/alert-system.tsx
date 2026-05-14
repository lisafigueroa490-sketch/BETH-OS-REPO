"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell, BellOff, Volume2 } from "lucide-react"

export type AlertSeverity = "critical" | "warning" | "info" | "success"

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  message: string
  timestamp: Date
  autoDismiss?: boolean
}

const sampleAlerts: Alert[] = [
  {
    id: "1",
    severity: "critical",
    title: "SECURITY BREACH ATTEMPT",
    message: "Unauthorized access detected from IP 192.168.1.45",
    timestamp: new Date(),
    autoDismiss: false,
  },
  {
    id: "2",
    severity: "warning",
    title: "HIGH MEMORY USAGE",
    message: "System memory at 87% capacity",
    timestamp: new Date(Date.now() - 120000),
    autoDismiss: true,
  },
  {
    id: "3",
    severity: "info",
    title: "ALGORITHM UPDATE",
    message: "NEXUS-7 optimization complete",
    timestamp: new Date(Date.now() - 300000),
    autoDismiss: true,
  },
]

interface AlertSystemProps {
  onAlertCountChange?: (count: number) => void
}

export function AlertSystem({ onAlertCountChange }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setAlerts([])
  }, [])

  // Notify parent of alert count changes
  useEffect(() => {
    onAlertCountChange?.(alerts.length)
  }, [alerts.length, onAlertCountChange])

  // Auto-dismiss alerts after 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => 
        prev.filter(alert => 
          !alert.autoDismiss || 
          Date.now() - alert.timestamp.getTime() < 30000
        )
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Simulate new alerts occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const newAlerts: Omit<Alert, "id" | "timestamp">[] = [
          { severity: "info", title: "DATA SYNC COMPLETE", message: "All nodes synchronized", autoDismiss: true },
          { severity: "warning", title: "NETWORK LATENCY", message: "Response time elevated to 145ms", autoDismiss: true },
          { severity: "success", title: "BACKUP COMPLETE", message: "System backup successful", autoDismiss: true },
        ]
        const randomAlert = newAlerts[Math.floor(Math.random() * newAlerts.length)]
        setAlerts(prev => [{
          ...randomAlert,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        }, ...prev].slice(0, 5))
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return <AlertCircle className="w-4 h-4" />
      case "warning": return <AlertTriangle className="w-4 h-4" />
      case "info": return <Info className="w-4 h-4" />
      case "success": return <CheckCircle className="w-4 h-4" />
    }
  }

  const getAlertStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical": return "border-destructive/50 bg-destructive/10 text-destructive"
      case "warning": return "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"
      case "info": return "border-blue-500/50 bg-blue-500/10 text-blue-500"
      case "success": return "border-primary/50 bg-primary/10 text-primary"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const criticalCount = alerts.filter(a => a.severity === "critical").length

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className={`w-5 h-5 ${criticalCount > 0 ? "text-destructive" : "text-primary"}`} />
            {alerts.length > 0 && (
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                criticalCount > 0 ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
              }`}>
                {alerts.length}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider text-foreground">
              ALERT SYSTEM
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {alerts.length === 0 ? "NO ACTIVE ALERTS" : `${alerts.length} ACTIVE`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSoundEnabled(!soundEnabled)
            }}
            className="p-1.5 rounded hover:bg-muted/50 transition-colors"
            title={soundEnabled ? "Mute alerts" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {alerts.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearAll()
              }}
              className="text-[10px] px-2 py-1 rounded bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
            >
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      {/* Alert List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mb-2 text-primary/50" />
              <p className="text-xs">ALL SYSTEMS NOMINAL</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 border-l-2 ${getAlertStyles(alert.severity)} transition-all`}
                >
                  <div className="mt-0.5">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold truncate">{alert.title}</h4>
                      {alert.severity === "critical" && (
                        <span className="animate-pulse text-[9px] px-1 py-0.5 rounded bg-destructive/20 text-destructive">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-[9px] text-muted-foreground/70 mt-1 font-mono">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 rounded hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
