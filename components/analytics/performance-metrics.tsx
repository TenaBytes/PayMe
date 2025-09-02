"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Clock } from "lucide-react"
import { useMemo } from "react"

interface PerformanceMetricsProps {
  investments: any[]
  balances: any[]
  detailed?: boolean
}

export function PerformanceMetrics({ investments, balances, detailed = false }: PerformanceMetricsProps) {
  const metrics = useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0)
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.actual_return), 0)
    const expectedReturns = investments.reduce((sum, inv) => sum + Number(inv.expected_return), 0)
    const activeInvestments = investments.filter((inv) => inv.status === "active").length
    const completedInvestments = investments.filter((inv) => inv.status === "completed").length

    const roi = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
    const expectedRoi = totalInvested > 0 ? (expectedReturns / totalInvested) * 100 : 0

    // Calculate average APY
    const avgApy =
      investments.length > 0
        ? investments.reduce((sum, inv) => sum + (inv.investment_packages?.apy_rate || 0), 0) / investments.length
        : 0

    return {
      totalInvested,
      totalReturns,
      expectedReturns,
      activeInvestments,
      completedInvestments,
      roi,
      expectedRoi,
      avgApy,
    }
  }, [investments])

  const performanceCards = [
    {
      title: "Total Returns",
      value: `$${metrics.totalReturns.toLocaleString()}`,
      description: "Lifetime earnings",
      icon: DollarSign,
      trend: `${metrics.roi.toFixed(1)}% ROI`,
      color: "text-green-600",
    },
    {
      title: "Expected Returns",
      value: `$${metrics.expectedReturns.toLocaleString()}`,
      description: "Projected earnings",
      icon: TrendingUp,
      trend: `${metrics.expectedRoi.toFixed(1)}% Expected ROI`,
      color: "text-blue-600",
    },
    {
      title: "Active Investments",
      value: metrics.activeInvestments.toString(),
      description: "Currently running",
      icon: Clock,
      trend: `${metrics.completedInvestments} completed`,
      color: "text-primary",
    },
    {
      title: "Average APY",
      value: `${metrics.avgApy.toFixed(1)}%`,
      description: "Across all investments",
      icon: TrendingUp,
      trend: "Weighted average",
      color: "text-primary",
    },
  ]

  if (!detailed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Your investment performance overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceCards.slice(0, 2).map((metric) => (
            <div key={metric.title} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="font-medium">{metric.title}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{metric.value}</p>
                <p className={`text-xs ${metric.color}`}>{metric.trend}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {performanceCards.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            <div className="flex items-center pt-1">
              <span className={`text-xs font-medium ${metric.color}`}>{metric.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* ROI Progress */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Return on Investment Progress</CardTitle>
          <CardDescription>How your investments are performing against expectations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Actual ROI</span>
              <span>{metrics.roi.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(metrics.roi, 100)} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Expected ROI</span>
              <span>{metrics.expectedRoi.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(metrics.expectedRoi, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
