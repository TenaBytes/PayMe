import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminOverview } from "@/components/admin/admin-overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserStats } from "@/components/admin/user-stats"
import { InvestmentStats } from "@/components/admin/investment-stats"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: userProfile } = await supabase.from("profiles").select("is_admin").eq("id", authUser.id).single()

  if (!userProfile?.is_admin) {
    redirect("/dashboard")
  }

  // Fetch admin statistics
  const [
    { count: usersCount },
    { count: investmentsCount },
    { count: kycCount },
    { data: transactions },
    { data: users },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("investments").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("kyc_status", "pending"),
    supabase
      .from("transactions")
      .select("*, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  return (
    <AdminLayout user={authUser} profile={userProfile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        <AdminOverview
          totalUsers={usersCount || 0}
          totalInvestments={investmentsCount || 0}
          pendingKyc={kycCount || 0}
        />

        <div className="grid lg:grid-cols-2 gap-8">
          <UserStats recentUsers={users || []} />
          <InvestmentStats />
        </div>

        <RecentActivity transactions={transactions || []} />
      </div>
    </AdminLayout>
  )
}
