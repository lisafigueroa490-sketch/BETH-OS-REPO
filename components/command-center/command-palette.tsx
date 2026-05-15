"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { 
  Command, 
  Search, 
  Settings, 
  Power, 
  RefreshCw, 
  Zap, 
  Database, 
  Shield, 
  Wifi,
  Activity,
  Terminal,
  X
} from "lucide-react"

interface CommandItem {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  shortcut?: string
  action: () => void
  category: "system" | "algorithms" | "network" | "settings"
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings?: () => void
}

export function CommandPalette({ isOpen, onClose, onOpenSettings }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const commands: CommandItem[] = [
    {
      id: "refresh-data",
      icon: <RefreshCw className="w-4 h-4" />,
      label: "REFRESH ALL DATA",
      description: "Reload all system metrics and feeds",
      shortcut: "R",
      action: () => { window.location.reload() },
      category: "system",
    },
    {
      id: "toggle-algorithms",
      icon: <Zap className="w-4 h-4" />,
      label: "TOGGLE ALGORITHMS",
      description: "Enable or disable algorithm processing",
      shortcut: "A",
      action: () => { console.log("[v0] Toggle algorithms") },
      category: "algorithms",
    },
    {
      id: "run-nexus",
      icon: <Activity className="w-4 h-4" />,
      label: "RUN NEXUS-7",
      description: "Execute NEXUS-7 algorithm cycle",
      action: () => { console.log("[v0] Running NEXUS-7") },
      category: "algorithms",
    },
    {
      id: "run-quantum",
      icon: <Activity className="w-4 h-4" />,
      label: "RUN QUANTUM-X",
      description: "Execute QUANTUM-X processing",
      action: () => { console.log("[v0] Running QUANTUM-X") },
      category: "algorithms",
    },
    {
      id: "scan-network",
      icon: <Wifi className="w-4 h-4" />,
      label: "SCAN NETWORK",
      description: "Perform full network scan",
      shortcut: "N",
      action: () => { console.log("[v0] Network scan initiated") },
      category: "network",
    },
    {
      id: "database-sync",
      icon: <Database className="w-4 h-4" />,
      label: "DATABASE SYNC",
      description: "Synchronize all database nodes",
      shortcut: "D",
      action: () => { console.log("[v0] Database sync started") },
      category: "network",
    },
    {
      id: "security-scan",
      icon: <Shield className="w-4 h-4" />,
      label: "SECURITY SCAN",
      description: "Run comprehensive security audit",
      shortcut: "S",
      action: () => { console.log("[v0] Security scan started") },
      category: "system",
    },
    {
      id: "terminal",
      icon: <Terminal className="w-4 h-4" />,
      label: "OPEN TERMINAL",
      description: "Access system terminal interface",
      shortcut: "T",
      action: () => { console.log("[v0] Terminal opened") },
      category: "system",
    },
    {
      id: "settings",
      icon: <Settings className="w-4 h-4" />,
      label: "SETTINGS",
      description: "Open system settings",
      shortcut: ",",
      action: () => { onOpenSettings?.() },
      category: "settings",
    },
    {
      id: "shutdown",
      icon: <Power className="w-4 h-4" />,
      label: "SYSTEM SHUTDOWN",
      description: "Initiate safe system shutdown",
      action: () => { console.log("[v0] Shutdown initiated") },
      category: "system",
    },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const flatCommands = Object.values(groupedCommands).flat()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, flatCommands.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (flatCommands[selectedIndex]) {
          flatCommands[selectedIndex].action()
          onClose()
        }
        break
      case "Escape":
        e.preventDefault()
        onClose()
        break
    }
  }, [isOpen, flatCommands, selectedIndex, onClose])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    selectedElement?.scrollIntoView({ block: "nearest" })
  }, [selectedIndex])

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "system": return "SYSTEM"
      case "algorithms": return "ALGORITHMS"
      case "network": return "NETWORK"
      case "settings": return "SETTINGS"
      default: return category.toUpperCase()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Command className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold tracking-wider text-foreground">COMMAND PALETTE</span>
          <div className="ml-auto flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border text-muted-foreground">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
        </div>

        {/* Command List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {flatCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No commands found
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category}>
                <div className="px-4 py-1.5 text-[10px] font-bold text-muted-foreground tracking-wider">
                  {getCategoryLabel(category)}
                </div>
                {cmds.map((cmd) => {
                  const globalIndex = flatCommands.findIndex(c => c.id === cmd.id)
                  return (
                    <button
                      key={cmd.id}
                      data-index={globalIndex}
                      onClick={() => {
                        cmd.action()
                        onClose()
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className={selectedIndex === globalIndex ? "text-primary" : "text-muted-foreground"}>
                        {cmd.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold tracking-wide">{cmd.label}</div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {cmd.description}
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border border-border text-muted-foreground">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border border-border">↑</kbd>
              <kbd className="px-1 py-0.5 bg-muted rounded border border-border">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-muted rounded border border-border">↵</kbd>
              select
            </span>
          </div>
          <span>BETH OS v3.5</span>
        </div>
      </div>
    </div>
  )
}

// Hook for keyboard shortcut
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return { isOpen, setIsOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
}
