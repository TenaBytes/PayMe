import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users, TrendingUp } from "lucide-react"

interface CryptoOverviewProps {
  profile: any
}

export function CryptoOverview({ profile }: CryptoOverviewProps) {
  const usdtBalance = profile?.balance_usdt || 0
  const trxBalance = profile?.balance_trx || 0
  const referralCount = profile?.referral_count || 0
  const totalEarnings = profile?.total_referral_earnings || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${usdtBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Available for withdrawal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">TRX Balance</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trxBalance.toFixed(2)} TRX</div>
          <p className="text-xs text-muted-foreground">TRON network balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{referralCount}</div>
          <p className="text-xs text-muted-foreground">Active referrals</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total earned from referrals</p>
        </CardContent>
      </Card>
    </div>
  )
}
