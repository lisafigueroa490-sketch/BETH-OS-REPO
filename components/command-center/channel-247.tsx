"use client"

import { useState, useEffect } from "react"
import { Radio, Signal, Wifi, Clock, Activity, Circle } from "lucide-react"

interface ChannelData {
  id: string
  name: string
  status: "LIVE" | "STANDBY" | "OFFLINE"
  uptime: number
  lastActivity: Date
  signalStrength: number
  dataRate: number
}

const initialChannels: ChannelData[] = [
  {
    id: "CH-001",
    name: "PRIMARY FEED",
    status: "LIVE",
    uptime: 99.7,
    lastActivity: new Date(),
    signalStrength: 94,
    dataRate: 847.2,
  },
  {
    id: "CH-002",
    name: "BACKUP STREAM",
    status: "STANDBY",
    uptime: 100,
    lastActivity: new Date(Date.now() - 3600000),
    signalStrength: 88,
    dataRate: 0,
  },
  {
    id: "CH-003",
    name: "ANALYTICS PIPE",
    status: "LIVE",
    uptime: 98.2,
    lastActivity: new Date(),
    signalStrength: 91,
    dataRate: 423.8,
  },
]

export function Channel247() {
  const [channels, setChannels] = useState<ChannelData[]>(initialChannels)
  const [activeHours, setActiveHours] = useState<boolean[]>(
    Array(24).fill(false).map((_, i) => i <= new Date().getHours())
  )
  const [totalUptime, setTotalUptime] = useState(99.3)

  useEffect(() => {
    const interval = setInterval(() => {
      setChannels(prev =>
        prev.map(ch => ({
          ...ch,
          lastActivity: ch.status === "LIVE" ? new Date() : ch.lastActivity,
          signalStrength: ch.status === "LIVE" 
            ? Math.min(100, Math.max(70, ch.signalStrength + (Math.random() - 0.5) * 4))
            : ch.signalStrength,
          dataRate: ch.status === "LIVE"
            ? Math.max(0, ch.dataRate + (Math.random() - 0.5) * 50)
            : 0,
        }))
      )
      
      // Update active hours
      const currentHour = new Date().getHours()
      setActiveHours(prev => prev.map((_, i) => i <= currentHour))
      
      // Slight uptime fluctuation
      setTotalUptime(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.3) * 0.1)))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    if (diff < 60000) return "JUST NOW"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m AGO`
    return `${Math.floor(diff / 3600000)}h AGO`
  }

  const getStatusColor = (status: ChannelData["status"]) => {
    switch (status) {
      case "LIVE": return "text-primary bg-primary/20 border-primary/50"
      case "STANDBY": return "text-yellow-500 bg-yellow-500/20 border-yellow-500/50"
      case "OFFLINE": return "text-destructive bg-destructive/20 border-destructive/50"
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-primary" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider text-foreground">
              CHANNEL 24/7
            </h3>
            <p className="text-[10px] text-muted-foreground">CONTINUOUS MONITORING</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary">{totalUptime.toFixed(1)}% UP</span>
        </div>
      </div>

      {/* 24-Hour Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>24H ACTIVITY</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date().getHours()}:00 LOCAL
          </span>
        </div>
        <div className="flex gap-0.5">
          {activeHours.map((active, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded-sm transition-all duration-300 ${
                active 
                  ? "bg-primary/80 shadow-[0_0_4px_rgba(0,255,136,0.4)]" 
                  : "bg-muted/30"
              }`}
              title={`${i.toString().padStart(2, "0")}:00`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Circular Uptime Indicator */}
      <div className="flex items-center justify-center py-2">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${totalUptime * 2.51} 251`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground tabular-nums">
              {totalUptime.toFixed(1)}%
            </span>
            <span className="text-[9px] text-muted-foreground">UPTIME</span>
          </div>
        </div>
      </div>

      {/* Channel List */}
      <div className="space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between p-2 bg-muted/10 rounded border border-border/50"
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${getStatusColor(channel.status)}`}>
                {channel.status === "LIVE" && (
                  <Circle className="w-2 h-2 fill-current animate-pulse" />
                )}
                {channel.status}
              </div>
              <div>
                <p className="text-xs font-mono text-foreground">{channel.name}</p>
                <p className="text-[9px] text-muted-foreground">{channel.id}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs">
                <Wifi className="w-3 h-3 text-muted-foreground" />
                <span className="font-mono text-foreground tabular-nums">
                  {channel.signalStrength.toFixed(0)}%
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground">
                {formatTime(channel.lastActivity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Rate Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[10px] font-mono">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Activity className="w-3 h-3" />
          TOTAL DATA RATE
        </div>
        <span className="text-primary tabular-nums">
          {channels.reduce((sum, ch) => sum + ch.dataRate, 0).toFixed(1)} KB/s
        </span>
      </div>
    </div>
  )
}
