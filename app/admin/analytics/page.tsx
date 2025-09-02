import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminAnalytics } from "@/components/analytics/admin-analytics"

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  // Fetch platform analytics data
  const [{ data: allUsers }, { data: allInvestments }, { data: allTransactions }, { data: packages }] =
    await Promise.all([
      supabase.from("profiles").select("created_at, kyc_status").order("created_at", { ascending: true }),
      supabase
        .from("investments")
        .select("*, investment_packages(name, apy_rate)")
        .order("created_at", { ascending: true }),
      supabase.from("transactions").select("*").order("created_at", { ascending: true }),
      supabase.from("investment_packages").select("*"),
    ])

  return (
    <AdminLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform performance and user insights</p>
        </div>

        <AdminAnalytics
          users={allUsers || []}
          investments={allInvestments || []}
          transactions={allTransactions || []}
          packages={packages || []}
        />
      </div>
    </AdminLayout>
  )
}
