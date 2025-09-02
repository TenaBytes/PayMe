"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Wallet, DollarSign, Clock } from "lucide-react"

interface PortfolioOverviewProps {
  balances: any[]
  investments: any[]
}

export function PortfolioOverview({ balances, investments }: PortfolioOverviewProps) {
  const totalBalance = balances.reduce((sum, balance) => sum + Number(balance.available_balance), 0)
  const totalInvested = balances.reduce((sum, balance) => sum + Number(balance.total_invested), 0)
  const totalReturns = balances.reduce((sum, balance) => sum + Number(balance.total_returns), 0)
  const activeInvestments = investments.length

  const stats = [
    {
      title: "Total Balance",
      value: `$${totalBalance.toLocaleString()}`,
      description: "Available funds",
      icon: Wallet,
      trend: "+2.5%",
    },
    {
      title: "Total Invested",
      value: `$${totalInvested.toLocaleString()}`,
      description: "Active investments",
      icon: TrendingUp,
      trend: "+12.3%",
    },
    {
      title: "Total Returns",
      value: `$${totalReturns.toLocaleString()}`,
      description: "Lifetime earnings",
      icon: DollarSign,
      trend: "+8.7%",
    },
    {
      title: "Active Investments",
      value: activeInvestments.toString(),
      description: "Running packages",
      icon: Clock,
      trend: `${activeInvestments} active`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div className="flex items-center pt-1">
              <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
