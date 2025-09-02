"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownLeft, TrendingUp, DollarSign, CreditCard } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface RecentActivityProps {
  transactions: any[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "investment":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "return":
        return <DollarSign className="h-4 w-4 text-green-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    }
    return email?.charAt(0).toUpperCase() || "U"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform transactions</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/transactions">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">
                      {getInitials(transaction.profiles?.full_name, transaction.profiles?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium capitalize">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.profiles?.full_name || transaction.profiles?.email || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {transaction.type === "withdrawal" ? "-" : "+"}${Number(transaction.amount).toLocaleString()}{" "}
                  {transaction.currency}
                </p>
                <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
