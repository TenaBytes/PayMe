"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Upload, CheckCircle, Clock, XCircle, FileText } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface KycVerificationProps {
  user: SupabaseUser
  profile: any
}

export function KycVerification({ user, profile }: KycVerificationProps) {
  const [documents, setDocuments] = useState<{
    idFront: File | null
    selfie: File | null
  }>({
    idFront: null,
    selfie: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleFileChange = (type: "idFront" | "selfie") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocuments((prev) => ({ ...prev, [type]: file }))
    }
  }

  const uploadDocument = async (file: File, path: string) => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${path}-${Date.now()}.${fileExt}`
    const filePath = `kyc/${fileName}`

    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file)

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!documents.idFront || !documents.selfie) {
      setMessage({ type: "error", text: "Please upload all required documents" })
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const [idFrontUrl, selfieUrl] = await Promise.all([
        uploadDocument(documents.idFront, "id-front"),
        uploadDocument(documents.selfie, "selfie"),
      ])

      const { error } = await supabase
        .from("profiles")
        .update({
          kyc_status: "pending",
          kyc_documents: {
            id_front: idFrontUrl,
            selfie: selfieUrl,
            submitted_at: new Date().toISOString(),
          },
        })
        .eq("id", user.id)

      if (error) throw error

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "KYC Documents Submitted",
        message:
          "Your KYC documents have been submitted for review. We'll notify you once the verification is complete.",
        type: "info",
      })

      setMessage({
        type: "success",
        text: "KYC documents submitted successfully! We'll review them within 24-48 hours.",
      })
      setDocuments({ idFront: null, selfie: null })

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-orange-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "verified":
        return "Your identity has been verified successfully."
      case "pending":
        return "Your documents are being reviewed. This usually takes 24-48 hours."
      case "rejected":
        return "Your documents were rejected. Please resubmit with correct information."
      default:
        return "Complete KYC verification to unlock all platform features."
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(profile?.kyc_status)}
                KYC Verification
              </CardTitle>
              <CardDescription>Verify your identity to access all platform features</CardDescription>
            </div>
            <Badge variant={getStatusColor(profile?.kyc_status)} className="capitalize">
              {profile?.kyc_status || "Not Started"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>{getStatusMessage(profile?.kyc_status)}</AlertDescription>
          </Alert>

          {profile?.kyc_status === "verified" ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Identity Verified</h3>
              <p className="text-muted-foreground">Your account is fully verified and ready to use.</p>
            </div>
          ) : profile?.kyc_status === "pending" ? (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Under Review</h3>
              <p className="text-muted-foreground">
                Your documents are being reviewed. We'll notify you once the verification is complete.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idFront">Government ID (Front)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="idFront" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      {documents.idFront ? documents.idFront.name : "Click to upload front of ID"}
                    </span>
                    <Input
                      id="idFront"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("idFront")}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selfie">Selfie Photo</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="selfie" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      {documents.selfie ? documents.selfie.name : "Click to upload your selfie"}
                    </span>
                    <Input
                      id="selfie"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange("selfie")}
                      className="hidden"
                    />
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Take a clear photo of yourself without holding any documents
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Government-issued photo ID (passport, driver's license, or national ID)</li>
                  <li>• Clear, high-quality images</li>
                  <li>• All text and details must be clearly visible on ID</li>
                  <li>• Selfie must clearly show your face</li>
                </ul>
              </div>

              {message && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isLoading || !documents.idFront || !documents.selfie} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Documents...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
