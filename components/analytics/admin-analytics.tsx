"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useMemo } from "react"

interface AdminAnalyticsProps {
  users: any[]
  investments: any[]
  transactions: any[]
  packages: any[]
}

export function AdminAnalytics({ users, investments, transactions, packages }: AdminAnalyticsProps) {
  const userGrowthData = useMemo(() => {
    const monthlyUsers = users.reduce((acc, user) => {
      const month = new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as any)

    return Object.entries(monthlyUsers).map(([month, count]) => ({ month, users: count }))
  }, [users])

  const revenueData = useMemo(() => {
    const monthlyRevenue = transactions
      .filter((tx) => tx.status === "completed" && tx.type === "investment")
      .reduce((acc, tx) => {
        const month = new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        acc[month] = (acc[month] || 0) + Number(tx.amount) * 0.01 // Assuming 1% platform fee
        return acc
      }, {} as any)

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }))
  }, [transactions])

  const packagePerformance = useMemo(() => {
    const packageStats = packages.map((pkg) => {
      const packageInvestments = investments.filter((inv) => inv.investment_packages?.name === pkg.name)
      const totalAmount = packageInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0)
      const count = packageInvestments.length

      return {
        name: pkg.name,
        investments: count,
        amount: totalAmount,
        apy: pkg.apy_rate,
      }
    })

    return packageStats.sort((a, b) => b.amount - a.amount)
  }, [packages, investments])

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="revenue">Revenue</TabsTrigger>
        <TabsTrigger value="packages">Packages</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Platform revenue from fees</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>Detailed user analytics and KYC status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.kyc_status === "verified").length}
                </div>
                <div className="text-sm text-muted-foreground">Verified KYC</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {users.filter((u) => u.kyc_status === "pending").length}
                </div>
                <div className="text-sm text-muted-foreground">Pending KYC</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="revenue" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Platform revenue breakdown and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="packages" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Package Performance</CardTitle>
            <CardDescription>Investment package popularity and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packagePerformance.map((pkg) => (
                <div key={pkg.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.apy}% APY</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${pkg.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{pkg.investments} investments</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
