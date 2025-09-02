import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CryptoOverview } from "@/components/dashboard/crypto-overview"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { NewsSection } from "@/components/dashboard/news-section"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: deposits } = await supabase
    .from("deposits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: todaySpin } = await supabase
    .from("wheel_spins")
    .select("*")
    .eq("user_id", user.id)
    .eq("spin_date", new Date().toISOString().split("T")[0])
    .single()

  const canSpinWheel = !todaySpin

  return (
    <DashboardLayout user={user} profile={profile}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || user.email}</p>
        </div>

        <CryptoOverview profile={profile} />

        <div className="grid lg:grid-cols-2 gap-8">
          <QuickActions profile={profile} canSpinWheel={canSpinWheel} />

          <RecentActivity deposits={deposits || []} withdrawals={withdrawals || []} />
        </div>

        <NewsSection news={news || []} />
      </div>
    </DashboardLayout>
  )
}
