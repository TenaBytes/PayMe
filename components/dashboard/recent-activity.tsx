import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityProps {
  deposits: any[]
  withdrawals: any[]
}

export function RecentActivity({ deposits, withdrawals }: RecentActivityProps) {
  // Combine and sort all activities
  const activities = [
    ...deposits.map((d) => ({ ...d, type: "deposit" })),
    ...withdrawals.map((w) => ({ ...w, type: "withdrawal" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {activity.type === "deposit" ? (
                    <ArrowDownToLine className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium capitalize">
                      {activity.type} - {activity.coin}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {activity.type === "deposit" ? "+" : "-"}
                    {activity.amount} {activity.coin}
                  </p>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
