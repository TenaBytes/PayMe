"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, TrendingUp, Shield } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    adminPassword: "", // Added admin password field
  })
  const [isAdmin, setIsAdmin] = useState(false) // Added admin checkbox state
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (isAdmin && formData.adminPassword !== "Dondoller$96$") {
      setError("Invalid admin password. Please contact system administrator.")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}${isAdmin ? "/admin" : "/dashboard"}`,
          data: {
            full_name: formData.fullName,
            is_admin: isAdmin,
          },
        },
      })
      if (error) throw error
      router.push("/auth/signup-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">WealthNexus</h1>
          <p className="text-muted-foreground mt-2">Start your investment journey today</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create account</CardTitle>
            <CardDescription>Join thousands of successful investors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adminSignup"
                    checked={isAdmin}
                    onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                  />
                  <Label htmlFor="adminSignup" className="flex items-center space-x-2 text-sm font-medium">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span>Sign up as Administrator</span>
                  </Label>
                </div>

                {isAdmin && (
                  <div className="space-y-2 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <Label htmlFor="adminPassword" className="text-red-700 dark:text-red-300 font-medium">
                      Admin Verification Password
                    </Label>
                    <Input
                      id="adminPassword"
                      name="adminPassword"
                      type="password"
                      placeholder="Enter admin verification password"
                      value={formData.adminPassword}
                      onChange={handleInputChange}
                      required={isAdmin}
                      className="h-11 border-red-300 dark:border-red-700"
                    />
                    <p className="text-xs text-red-600 dark:text-red-400">
                      This password is required to verify administrator privileges
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    {isAdmin && <Shield className="mr-2 h-4 w-4" />}
                    Create {isAdmin ? "Admin" : ""} account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm space-y-2">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
