"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, Eye, User } from "lucide-react"

interface KycSubmission {
  id: string
  full_name: string
  email: string
  avatar_url: string
  kyc_status: string
  kyc_documents: {
    id_front: string
    selfie: string
    submitted_at: string
  }
  created_at: string
}

export default function AdminKycPage() {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const mockSubmissions: KycSubmission[] = [
      {
        id: "1",
        full_name: "John Smith",
        email: "john.smith@example.com",
        avatar_url: "/placeholder.svg?height=40&width=40",
        kyc_status: "pending",
        kyc_documents: {
          id_front: "/government-id-front.png",
          selfie: "/diverse-group-selfie.png",
          submitted_at: "2024-01-15T10:30:00Z",
        },
        created_at: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        full_name: "Sarah Johnson",
        email: "sarah.j@example.com",
        avatar_url: "/placeholder.svg?height=40&width=40",
        kyc_status: "pending",
        kyc_documents: {
          id_front: "/generic-identification-card-front.png",
          selfie: "/woman-selfie.png",
          submitted_at: "2024-01-14T15:45:00Z",
        },
        created_at: "2024-01-14T15:45:00Z",
      },
    ]
    setSubmissions(mockSubmissions)
  }, [])

  const handleKycDecision = async (submissionId: string, decision: "approved" | "rejected") => {
    setIsLoading(true)
    setMessage(null)

    try {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === submissionId ? { ...sub, kyc_status: decision === "approved" ? "verified" : "rejected" } : sub,
        ),
      )

      setMessage({
        type: "success",
        text: `KYC submission ${decision === "approved" ? "approved" : "rejected"} successfully!`,
      })

      setSelectedSubmission(null)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <User className="h-4 w-4 text-gray-600" />
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">KYC Management</h1>
        <p className="text-muted-foreground">Review and approve user identity verification submissions</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* KYC Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
            <CardDescription>Users awaiting KYC verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissions
              .filter((sub) => sub.kyc_status === "pending")
              .map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={submission.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{submission.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{submission.full_name}</p>
                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(submission.kyc_status)} className="capitalize">
                      {getStatusIcon(submission.kyc_status)}
                      {submission.kyc_status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            {submissions.filter((sub) => sub.kyc_status === "pending").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending submissions</p>
            )}
          </CardContent>
        </Card>

        {/* KYC Review Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Document Review</CardTitle>
            <CardDescription>
              {selectedSubmission ? "Review submitted documents" : "Select a submission to review"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSubmission ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedSubmission.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{selectedSubmission.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedSubmission.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(selectedSubmission.kyc_documents.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Government ID (Front)</h4>
                    <div className="border rounded-lg p-2">
                      <img
                        src={selectedSubmission.kyc_documents.id_front || "/placeholder.svg"}
                        alt="Government ID Front"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Selfie Photo</h4>
                    <div className="border rounded-lg p-2">
                      <img
                        src={selectedSubmission.kyc_documents.selfie || "/placeholder.svg"}
                        alt="User Selfie"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleKycDecision(selectedSubmission.id, "approved")}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleKycDecision(selectedSubmission.id, "rejected")}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a KYC submission to review documents</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
