import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminOverview } from "@/components/admin/admin-overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserStats } from "@/components/admin/user-stats"
import { InvestmentStats } from "@/components/admin/investment-stats"

export default async function AdminPage() {
  let user = null
  let profile = null
  let totalUsers = 0
  let totalInvestments = 0
  let pendingKyc = 0
  let recentTransactions: any[] = []
  let recentUsers: any[] = []

  try {
    const supabase = await createClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      redirect("/auth/login")
    }

    user = authUser

    // Check if user is admin
    const { data: userProfile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!userProfile?.is_admin) {
      redirect("/dashboard")
    }

    profile = userProfile

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

    totalUsers = usersCount || 0
    totalInvestments = investmentsCount || 0
    pendingKyc = kycCount || 0
    recentTransactions = transactions || []
    recentUsers = users || []
  } catch (error) {
    console.log("[v0] Supabase not configured, using mock admin data")

    user = {
      id: "admin-mock-id",
      email: "nattyneck@gmail.com",
      user_metadata: {
        full_name: "Admin User",
      },
    }

    profile = {
      is_admin: true,
      full_name: "Admin User",
    }

    // Mock statistics for demo purposes
    totalUsers = 1247
    totalInvestments = 892
    pendingKyc = 23

    // Mock recent transactions
    recentTransactions = [
      {
        id: "1",
        amount: 5000,
        type: "deposit",
        status: "completed",
        created_at: new Date().toISOString(),
        profiles: { full_name: "John Doe", email: "john@example.com" },
      },
      {
        id: "2",
        amount: 2500,
        type: "investment",
        status: "pending",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profiles: { full_name: "Jane Smith", email: "jane@example.com" },
      },
    ]

    // Mock recent users
    recentUsers = [
      {
        id: "1",
        full_name: "Alice Johnson",
        email: "alice@example.com",
        created_at: new Date().toISOString(),
        kyc_status: "approved",
      },
      {
        id: "2",
        full_name: "Bob Wilson",
        email: "bob@example.com",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        kyc_status: "pending",
      },
    ]
  }

  return (
    <AdminLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        <AdminOverview totalUsers={totalUsers} totalInvestments={totalInvestments} pendingKyc={pendingKyc} />

        <div className="grid lg:grid-cols-2 gap-8">
          <UserStats recentUsers={recentUsers} />
          <InvestmentStats />
        </div>

        <RecentActivity transactions={recentTransactions} />
      </div>
    </AdminLayout>
  )
}
