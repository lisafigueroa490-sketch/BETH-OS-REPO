"use client"

import { useState } from "react"
import { 
  Settings, 
  X, 
  Monitor, 
  Bell, 
  RefreshCw, 
  Moon, 
  Sun,
  Volume2,
  VolumeX,
  Gauge,
  Shield,
  Database
} from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SettingsState {
  refreshRate: number
  autoUpdate: boolean
  darkMode: boolean
  soundEnabled: boolean
  animationsEnabled: boolean
  compactMode: boolean
  securityLevel: "low" | "medium" | "high"
  dataRetention: number
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<SettingsState>({
    refreshRate: 2000,
    autoUpdate: true,
    darkMode: true,
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false,
    securityLevel: "high",
    dataRetention: 30,
  })

  const [activeTab, setActiveTab] = useState<"general" | "display" | "security">("general")

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">SYSTEM SETTINGS</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["general", "display", "security"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2.5 text-xs font-bold tracking-wider transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === "general" && (
            <>
              {/* Refresh Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">REFRESH RATE</span>
                  </div>
                  <span className="text-xs font-mono text-primary">
                    {settings.refreshRate / 1000}s
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="1000"
                  value={settings.refreshRate}
                  onChange={(e) => updateSetting("refreshRate", Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                  <span>1s</span>
                  <span>5s</span>
                  <span>10s</span>
                </div>
              </div>

              {/* Auto Update */}
              <SettingToggle
                icon={<RefreshCw className="w-4 h-4" />}
                label="AUTO UPDATE"
                description="Automatically refresh data"
                value={settings.autoUpdate}
                onChange={(value) => updateSetting("autoUpdate", value)}
              />

              {/* Sound */}
              <SettingToggle
                icon={settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                label="SOUND ALERTS"
                description="Enable audio notifications"
                value={settings.soundEnabled}
                onChange={(value) => updateSetting("soundEnabled", value)}
              />

              {/* Data Retention */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">DATA RETENTION</span>
                  </div>
                  <span className="text-xs font-mono text-primary">
                    {settings.dataRetention} days
                  </span>
                </div>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => updateSetting("dataRetention", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>
            </>
          )}

          {activeTab === "display" && (
            <>
              {/* Dark Mode */}
              <SettingToggle
                icon={settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                label="DARK MODE"
                description="Use dark color scheme"
                value={settings.darkMode}
                onChange={(value) => updateSetting("darkMode", value)}
              />

              {/* Animations */}
              <SettingToggle
                icon={<Gauge className="w-4 h-4" />}
                label="ANIMATIONS"
                description="Enable UI animations"
                value={settings.animationsEnabled}
                onChange={(value) => updateSetting("animationsEnabled", value)}
              />

              {/* Compact Mode */}
              <SettingToggle
                icon={<Monitor className="w-4 h-4" />}
                label="COMPACT MODE"
                description="Reduce spacing and padding"
                value={settings.compactMode}
                onChange={(value) => updateSetting("compactMode", value)}
              />
            </>
          )}

          {activeTab === "security" && (
            <>
              {/* Security Level */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-foreground">SECURITY LEVEL</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSetting("securityLevel", level)}
                      className={`px-3 py-2 text-xs font-bold rounded border transition-colors ${
                        settings.securityLevel === level
                          ? level === "high"
                            ? "bg-primary/20 border-primary text-primary"
                            : level === "medium"
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                            : "bg-destructive/20 border-destructive text-destructive"
                          : "bg-muted/50 border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {settings.securityLevel === "high" && "Maximum security protocols enabled"}
                  {settings.securityLevel === "medium" && "Balanced security and performance"}
                  {settings.securityLevel === "low" && "Minimal security checks (not recommended)"}
                </p>
              </div>

              {/* Security Status */}
              <div className="p-3 bg-muted/30 rounded border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Firewall</span>
                  <span className="text-primary font-mono">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Encryption</span>
                  <span className="text-primary font-mono">AES-256</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last Scan</span>
                  <span className="text-foreground font-mono">2m ago</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <button
            onClick={() => setSettings({
              refreshRate: 2000,
              autoUpdate: true,
              darkMode: true,
              soundEnabled: true,
              animationsEnabled: true,
              compactMode: false,
              securityLevel: "high",
              dataRetention: 30,
            })}
            className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            RESET DEFAULTS
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  )
}

interface SettingToggleProps {
  icon: React.ReactNode
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}

function SettingToggle({ icon, label, description, value, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/20 rounded border border-border/50">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-xs font-bold text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          value ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  )
}
