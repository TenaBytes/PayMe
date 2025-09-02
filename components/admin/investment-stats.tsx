"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"

export function InvestmentStats() {
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    packageStats: [] as any[],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      // Fetch investment statistics
      const { data: investments } = await supabase.from("investments").select(`
        amount,
        expected_return,
        actual_return,
        investment_packages (
          name,
          currency
        )
      `)

      if (investments) {
        const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0)
        const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.actual_return), 0)

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

        const packageStats = Object.entries(packageGroups).map(([name, data]: [string, any]) => ({
          name,
          count: data.count,
          amount: data.amount,
          percentage: (data.amount / totalInvested) * 100,
        }))

        setStats({
          totalInvested,
          totalReturns,
          packageStats,
        })
      }

      setIsLoading(false)
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Statistics</CardTitle>
          <CardDescription>Loading investment data...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Statistics</CardTitle>
        <CardDescription>Platform investment breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Invested</p>
            <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Returns</p>
            <p className="text-2xl font-bold text-green-600">${stats.totalReturns.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Investment Distribution</h4>
          {stats.packageStats.map((pkg) => (
            <div key={pkg.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{pkg.name}</span>
                <span>{pkg.count} investments</span>
              </div>
              <Progress value={pkg.percentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${pkg.amount.toLocaleString()}</span>
                <span>{pkg.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
