"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, AlertCircle, DollarSign } from "lucide-react"

interface AdminOverviewProps {
  totalUsers: number
  totalInvestments: number
  pendingKyc: number
}

export function AdminOverview({ totalUsers, totalInvestments, pendingKyc }: AdminOverviewProps) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      description: "Registered users",
      icon: Users,
      trend: "+12% from last month",
      color: "text-blue-600",
    },
    {
      title: "Active Investments",
      value: totalInvestments.toLocaleString(),
      description: "Running investments",
      icon: TrendingUp,
      trend: "+8% from last month",
      color: "text-green-600",
    },
    {
      title: "Pending KYC",
      value: pendingKyc.toLocaleString(),
      description: "Awaiting verification",
      icon: AlertCircle,
      trend: `${pendingKyc} pending review`,
      color: "text-orange-600",
    },
    {
      title: "Platform Revenue",
      value: "$125,430",
      description: "This month",
      icon: DollarSign,
      trend: "+15% from last month",
      color: "text-primary",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
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
