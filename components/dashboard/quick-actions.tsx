"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ArrowUpFromLine, Sheet as Wheel, CreditCard, Newspaper, Share2, Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface QuickActionsProps {
  profile: any
  canSpinWheel: boolean
}

export function QuickActions({ profile, canSpinWheel }: QuickActionsProps) {
  const referralLink = `${window.location.origin}/signup?ref=${profile?.referral_code}`

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success("Referral link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy referral link")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quick Actions
          <Badge variant="secondary" className="text-xs">
            {profile?.referral_code}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="h-16 flex-col gap-2">
            <Link href="/dashboard/deposit">
              <ArrowDownToLine className="h-5 w-5" />
              <span className="text-sm">Deposit</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-16 flex-col gap-2 bg-transparent">
            <Link href="/dashboard/withdraw">
              <ArrowUpFromLine className="h-5 w-5" />
              <span className="text-sm">Withdraw</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={canSpinWheel ? "default" : "secondary"}
            className="h-16 flex-col gap-2"
            disabled={!canSpinWheel}
          >
            <Link href="/dashboard/wheel">
              <Wheel className="h-5 w-5" />
              <span className="text-sm">Lucky Wheel</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-16 flex-col gap-2 bg-transparent">
            <Link href="/dashboard/loans">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">Loans</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="ghost" className="h-12 flex-col gap-1">
            <Link href="/dashboard/news">
              <Newspaper className="h-4 w-4" />
              <span className="text-xs">News</span>
            </Link>
          </Button>

          <Button variant="ghost" className="h-12 flex-col gap-1" onClick={copyReferralLink}>
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share Link</span>
          </Button>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Your Referral Link:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted p-2 rounded truncate">{referralLink}</code>
            <Button size="sm" variant="ghost" onClick={copyReferralLink}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
