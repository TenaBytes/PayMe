"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfo } from "./personal-info"
import { SecuritySettings } from "./security-settings"
import { KycVerification } from "./kyc-verification"
import { NotificationSettings } from "./notification-settings"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface ProfileManagementProps {
  user: SupabaseUser
  profile: any
  notifications: any[]
}

export function ProfileManagement({ user, profile, notifications }: ProfileManagementProps) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfo user={user} profile={profile} />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySettings user={user} />
      </TabsContent>

      <TabsContent value="kyc">
        <KycVerification user={user} profile={profile} />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationSettings user={user} notifications={notifications} />
      </TabsContent>
    </Tabs>
  )
}
