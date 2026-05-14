"use client"

import { useEffect, useState } from "react"
import { SystemHeader } from "@/components/command-center/system-header"
import { ProfitTracker } from "@/components/command-center/profit-tracker"
import { AlgorithmStatus } from "@/components/command-center/algorithm-status"
import { DataHunter } from "@/components/command-center/data-hunter"
import { TerminalFeed } from "@/components/command-center/terminal-feed"
import { SystemMetrics } from "@/components/command-center/system-metrics"
import { NetworkGrid } from "@/components/command-center/network-grid"

export default function CommandCenter() {
  const [systemTime, setSystemTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onlineCheck = setInterval(() => {
      setIsOnline(prev => Math.random() > 0.02 ? true : prev)
    }, 5000)
    return () => clearInterval(onlineCheck)
  }, [])

  return (
    <div className="min-h-screen bg-background p-3 md:p-6 relative overflow-hidden">
      {/* Scan line effect */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,136,0.03)_2px,rgba(0,255,136,0.03)_4px)]" />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto space-y-4 md:space-y-6">
        <SystemHeader systemTime={systemTime} isOnline={isOnline} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column - Profit & Algorithms */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <ProfitTracker />
            <AlgorithmStatus />
          </div>

          {/* Center Column - Data Hunter & Terminal */}
          <div className="lg:col-span-5 space-y-4 md:space-y-6">
            <DataHunter />
            <TerminalFeed />
          </div>

          {/* Right Column - Metrics & Network */}
          <div className="lg:col-span-3 space-y-4 md:space-y-6">
            <SystemMetrics />
            <NetworkGrid />
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-card border border-border rounded-lg text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>LISA BETH OS v3.5</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">XRM_CORE_ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">MEM: 847.2 MB / 2048 MB</span>
            <span className="text-border hidden md:inline">|</span>
            <span>UPTIME: 127:42:18</span>
          </div>
        </div>
      </div>
    </div>
  )
}
