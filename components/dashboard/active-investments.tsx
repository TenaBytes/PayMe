"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatDistanceToNow } from "date-fns"

interface ActiveInvestmentsProps {
  investments: any[]
}

export function ActiveInvestments({ investments }: ActiveInvestmentsProps) {
  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = Date.now()
    const total = end - start
    const elapsed = now - start
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Investments</CardTitle>
        <CardDescription>Your current investment positions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {investments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active investments</p>
            <p className="text-sm">Start investing to see your positions here</p>
          </div>
        ) : (
          investments.map((investment) => {
            const progress = calculateProgress(investment.start_date, investment.end_date)
            const isCompleted = progress >= 100

            return (
              <div key={investment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{investment.investment_packages?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${Number(investment.amount).toLocaleString()} {investment.currency}
                    </p>
                  </div>
                  <Badge variant={isCompleted ? "default" : "secondary"}>
                    {investment.investment_packages?.apy_rate}% APY
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Expected Return</p>
                    <p className="font-medium text-green-600">
                      +${Number(investment.expected_return).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Remaining</p>
                    <p className="font-medium">
                      {isCompleted
                        ? "Completed"
                        : formatDistanceToNow(new Date(investment.end_date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
