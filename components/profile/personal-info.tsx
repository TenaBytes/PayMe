"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Upload } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface PersonalInfoProps {
  user: SupabaseUser
  profile: any
}

export function PersonalInfo({ user, profile }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    country: profile?.country || "",
    wallet_address: profile?.wallet_address || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        localStorage.setItem("userAvatar", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      const reader = new FileReader()
      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const result = reader.result as string
          localStorage.setItem("userAvatar", result)
          resolve(result)
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      let avatarUrl = profile?.avatar_url || localStorage.getItem("userAvatar")

      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile)
      }

      try {
        const supabase = createClient()
        const { error } = await supabase
          .from("profiles")
          .update({
            ...formData,
            avatar_url: avatarUrl,
          })
          .eq("id", user.id)

        if (error) throw error
      } catch (error) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            ...formData,
            avatar_url: avatarUrl,
          }),
        )
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setAvatarFile(null)
      setAvatarPreview(null)

      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return user.email?.charAt(0).toUpperCase() || "U"
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
  }

  const currentAvatar = avatarPreview || profile?.avatar_url || localStorage.getItem("userAvatar") || "/placeholder.svg"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentAvatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{getInitials(formData.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                    <Upload className="h-4 w-4" />
                    Change Avatar
                  </div>
                  <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </Label>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max 2MB)</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet_address">TRON Wallet Address</Label>
              <Input
                id="wallet_address"
                name="wallet_address"
                value={formData.wallet_address}
                onChange={handleInputChange}
                placeholder="TRX wallet address for withdrawals"
              />
              <p className="text-xs text-muted-foreground">
                This address will be used for withdrawals. Make sure it's correct.
              </p>
            </div>

            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
