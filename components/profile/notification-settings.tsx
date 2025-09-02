"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Bell, CheckCircle, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface NotificationSettingsProps {
  user: SupabaseUser
  notifications: any[]
}

export function NotificationSettings({ user, notifications: initialNotifications }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    investmentUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  })

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

    if (!error) {
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    }
  }

  const deleteNotification = async (notificationId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (!error) {
      setNotifications(notifications.filter((n) => n.id !== notificationId))
    }
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id)

    if (!error) {
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <Bell className="h-4 w-4 text-orange-600" />
      case "error":
        return <Bell className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="investmentUpdates" className="text-sm font-medium">
                Investment Updates
              </Label>
              <p className="text-sm text-muted-foreground">Updates about your investments and returns</p>
            </div>
            <Switch
              id="investmentUpdates"
              checked={settings.investmentUpdates}
              onCheckedChange={(checked) => setSettings({ ...settings, investmentUpdates: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="securityAlerts" className="text-sm font-medium">
                Security Alerts
              </Label>
              <p className="text-sm text-muted-foreground">Important security and account alerts</p>
            </div>
            <Switch
              id="securityAlerts"
              checked={settings.securityAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, securityAlerts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketingEmails" className="text-sm font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">Promotional offers and platform updates</p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Your latest notifications and alerts</CardDescription>
          </div>
          {notifications.some((n) => !n.is_read) && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">You'll see important updates here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg ${
                    !notification.is_read ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.is_read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      <Badge variant={getTypeColor(notification.type)} className="text-xs">
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && (
                      <Button onClick={() => markAsRead(notification.id)} variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button onClick={() => deleteNotification(notification.id)} variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
