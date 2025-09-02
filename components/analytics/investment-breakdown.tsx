"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { useMemo } from "react"

interface InvestmentBreakdownProps {
  investments: any[]
}

export function InvestmentBreakdown({ investments }: InvestmentBreakdownProps) {
  const { packageBreakdown, currencyBreakdown, statusBreakdown } = useMemo(() => {
    // Group by package
    const packageGroups = investments.reduce((acc, inv) => {
      const packageName = inv.investment_packages?.name || "Unknown"
      if (!acc[packageName]) {
        acc[packageName] = { count: 0, amount: 0 }
      }
      acc[packageName].count += 1
      acc[packageName].amount += Number(inv.amount)
      return acc
    }, {} as any)

    const packageBreakdown = Object.entries(packageGroups).map(([name, data]: [string, any]) => ({
      name,
      value: data.amount,
      count: data.count,
    }))

    // Group by currency
    const currencyGroups = investments.reduce((acc, inv) => {
      const currency = inv.currency || "Unknown"
      if (!acc[currency]) {
        acc[currency] = { count: 0, amount: 0 }
      }
      acc[currency].count += 1
      acc[currency].amount += Number(inv.amount)
      return acc
    }, {} as any)

    const currencyBreakdown = Object.entries(currencyGroups).map(([name, data]: [string, any]) => ({
      name,
      value: data.amount,
      count: data.count,
    }))

    // Group by status
    const statusGroups = investments.reduce((acc, inv) => {
      const status = inv.status || "Unknown"
      if (!acc[status]) {
        acc[status] = { count: 0, amount: 0 }
      }
      acc[status].count += 1
      acc[status].amount += Number(inv.amount)
      return acc
    }, {} as any)

    const statusBreakdown = Object.entries(statusGroups).map(([name, data]: [string, any]) => ({
      name,
      value: data.amount,
      count: data.count,
    }))

    return { packageBreakdown, currencyBreakdown, statusBreakdown }
  }, [investments])

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "#8884d8", "#82ca9d", "#ffc658"]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Package Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Investment by Package</CardTitle>
          <CardDescription>Distribution across different investment packages</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={packageBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {packageBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Currency Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Investment by Currency</CardTitle>
          <CardDescription>USDT vs TRX investment distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currencyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]} />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Investment Status Overview</CardTitle>
          <CardDescription>Active vs completed investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {statusBreakdown.map((status, index) => (
              <div key={status.name} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                  {status.count}
                </div>
                <div className="text-sm text-muted-foreground capitalize">{status.name}</div>
                <div className="text-xs text-muted-foreground">${status.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
