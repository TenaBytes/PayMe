"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioChart } from "./portfolio-chart"
import { InvestmentBreakdown } from "./investment-breakdown"
import { PerformanceMetrics } from "./performance-metrics"
import { TransactionHistory } from "./transaction-history"

interface UserAnalyticsProps {
  investments: any[]
  transactions: any[]
  balances: any[]
}

export function UserAnalytics({ investments, transactions, balances }: UserAnalyticsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <PortfolioChart investments={investments} transactions={transactions} />
          <PerformanceMetrics investments={investments} balances={balances} />
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-6">
        <PerformanceMetrics investments={investments} balances={balances} detailed />
      </TabsContent>

      <TabsContent value="breakdown" className="space-y-6">
        <InvestmentBreakdown investments={investments} />
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <TransactionHistory transactions={transactions} />
      </TabsContent>
    </Tabs>
  )
}
