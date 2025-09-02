"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

interface PortfolioChartProps {
  investments: any[]
  transactions: any[]
}

export function PortfolioChart({ investments, transactions }: PortfolioChartProps) {
  const chartData = useMemo(() => {
    // Combine investments and transactions to create portfolio timeline
    const events = [
      ...investments.map((inv) => ({
        date: new Date(inv.created_at),
        type: "investment",
        amount: Number(inv.amount),
        value: Number(inv.amount),
      })),
      ...transactions
        .filter((tx) => tx.status === "completed")
        .map((tx) => ({
          date: new Date(tx.created_at),
          type: tx.type,
          amount: Number(tx.amount),
          value: tx.type === "deposit" ? Number(tx.amount) : -Number(tx.amount),
        })),
    ].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Calculate cumulative portfolio value
    let cumulativeValue = 0
    const data = events.map((event, index) => {
      cumulativeValue += event.value
      return {
        date: event.date.toLocaleDateString(),
        value: Math.max(0, cumulativeValue),
        month: event.date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      }
    })

    // Group by month for cleaner chart
    const monthlyData = data.reduce((acc, item) => {
      const existing = acc.find((d) => d.month === item.month)
      if (existing) {
        existing.value = item.value // Use latest value for the month
      } else {
        acc.push({ month: item.month, value: item.value })
      }
      return acc
    }, [] as any[])

    return monthlyData.slice(-12) // Last 12 months
  }, [investments, transactions])

  const totalValue = chartData.length > 0 ? chartData[chartData.length - 1]?.value || 0 : 0
  const previousValue = chartData.length > 1 ? chartData[chartData.length - 2]?.value || 0 : 0
  const growth = previousValue > 0 ? ((totalValue - previousValue) / previousValue) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Growth</CardTitle>
        <CardDescription>Your investment portfolio value over time</CardDescription>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Current Value</p>
          </div>
          <div>
            <p className={`text-lg font-semibold ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Monthly Change</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Portfolio Value"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
