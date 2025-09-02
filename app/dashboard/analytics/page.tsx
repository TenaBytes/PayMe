import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UserAnalytics } from "@/components/analytics/user-analytics"

export default async function UserAnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user's investment data for analytics
  const { data: investments } = await supabase
    .from("investments")
    .select(
      `
      *,
      investment_packages (
        name,
        apy_rate,
        duration_days
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's transaction history
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch wallet balances
  const { data: balances } = await supabase.from("wallet_balances").select("*").eq("user_id", user.id)

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your investment performance and portfolio growth</p>
        </div>

        <UserAnalytics investments={investments || []} transactions={transactions || []} balances={balances || []} />
      </div>
    </DashboardLayout>
  )
}
