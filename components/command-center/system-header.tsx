"use client"

import { Activity, Wifi, WifiOff, Shield, Bell, Settings, Command } from "lucide-react"

interface SystemHeaderProps {
  systemTime: Date
  isOnline: boolean
  alertCount?: number
  onSettingsClick?: () => void
  onCommandPaletteClick?: () => void
}

export function SystemHeader({ 
  systemTime, 
  isOnline, 
  alertCount = 0,
  onSettingsClick,
  onCommandPaletteClick
}: SystemHeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
  }

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 border border-primary/50 flex items-center justify-center glow-border">
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-wider text-foreground">
            LISA BETH OS <span className="text-primary">v3.5</span>
          </h1>
          <p className="text-xs text-muted-foreground tracking-wide">
            AUTOMATED XRM COMMAND CENTER
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 text-xs font-mono w-full sm:w-auto justify-between sm:justify-end flex-wrap">
        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onCommandPaletteClick}
            className="p-2 rounded hover:bg-muted/50 transition-colors group"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 rounded hover:bg-muted/50 transition-colors group"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <button
            className="p-2 rounded hover:bg-muted/50 transition-colors group relative"
            title="Alerts"
          >
            <Bell className={`w-4 h-4 transition-colors ${alertCount > 0 ? "text-destructive" : "text-muted-foreground group-hover:text-primary"}`} />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                {alertCount > 9 ? "9+" : alertCount}
              </span>
            )}
          </button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground hidden sm:inline">SECURITY:</span>
          <span className="text-primary">ACTIVE</span>
        </div>

        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-primary" />
          ) : (
            <WifiOff className="w-4 h-4 text-destructive" />
          )}
          <span className={isOnline ? "text-primary" : "text-destructive"}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        <div className="text-right">
          <div className="text-lg md:text-xl text-foreground tabular-nums tracking-wider">
            {formatTime(systemTime)}
          </div>
          <div className="text-muted-foreground text-[10px]">
            {formatDate(systemTime)}
          </div>
        </div>
      </div>
    </header>
  )
}
