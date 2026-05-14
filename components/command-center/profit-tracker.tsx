"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const generateProfitData = () => {
  const data = []
  let value = 45000
  for (let i = 0; i < 24; i++) {
    value += (Math.random() - 0.45) * 2000
    data.push({
      hour: `${i.toString().padStart(2, "0")}:00`,
      profit: Math.max(0, value),
    })
  }
  return data
}

export function ProfitTracker() {
  const [profitData, setProfitData] = useState(generateProfitData)
  const [totalProfit, setTotalProfit] = useState(127842.56)
  const [dailyChange, setDailyChange] = useState(8.42)
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalProfit((prev) => {
        const change = (Math.random() - 0.4) * 100
        return prev + change
      })
      setDailyChange((prev) => {
        const change = (Math.random() - 0.5) * 0.5
        const newValue = prev + change
        setIsPositive(newValue >= 0)
        return newValue
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProfitData(generateProfitData())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-mono">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-foreground">PROFIT_TRACKER</span>
          </div>
          <span className="text-xs text-muted-foreground">24H</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
              ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center gap-1 mt-1 ${isPositive ? "text-primary" : "text-destructive"}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-mono">
                {isPositive ? "+" : ""}{dailyChange.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground font-mono space-y-1">
            <div className="flex items-center justify-end gap-1">
              <ArrowUpRight className="w-3 h-3 text-primary" />
              <span>HIGH: $132,481</span>
            </div>
            <div className="flex items-center justify-end gap-1">
              <ArrowDownRight className="w-3 h-3 text-destructive" />
              <span>LOW: $118,294</span>
            </div>
          </div>
        </div>

        <div className="h-32 md:h-40 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.75 0.18 160)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.75 0.18 160)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "oklch(0.6 0 0)" }}
                interval={5}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.005 240)",
                  border: "1px solid oklch(0.22 0.01 240)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.6 0 0)" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Profit"]}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="oklch(0.75 0.18 160)"
                strokeWidth={2}
                fill="url(#profitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
