import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { Testimonials } from "@/components/dashboard/testimonials" // replaced InvestmentPackages with Testimonials
import { ActiveInvestments } from "@/components/dashboard/active-investments"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch wallet balances
  const { data: balances } = await supabase.from("wallet_balances").select("*").eq("user_id", user.id)

  // Fetch active investments
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
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || user.email}</p>
        </div>

        <PortfolioOverview balances={balances || []} investments={investments || []} />

        <div className="grid lg:grid-cols-2 gap-8">
          <Testimonials /> {/* replaced InvestmentPackages with Testimonials */}
          <ActiveInvestments investments={investments || []} />
        </div>

        <RecentTransactions transactions={transactions || []} />
      </div>
    </DashboardLayout>
  )
}
