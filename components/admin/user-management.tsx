"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, CheckCircle, XCircle, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"

interface UserManagementProps {
  users: any[]
}

export function UserManagement({ users: initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getKycStatusColor = (status: string) => {
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

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    }
    return email?.charAt(0).toUpperCase() || "U"
  }

  const updateKycStatus = async (userId: string, status: string) => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ kyc_status: status }).eq("id", userId)

    if (!error) {
      setUsers(users.map((user) => (user.id === userId ? { ...user, kyc_status: status } : user)))
    }

    setIsLoading(false)
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ is_admin: !isAdmin }).eq("id", userId)

    if (!error) {
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_admin: !isAdmin } : user)))
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{getInitials(user.full_name, user.email)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name || "Unnamed User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getKycStatusColor(user.kyc_status)}>{user.kyc_status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.is_admin && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                    {!user.is_admin && <span className="text-sm text-muted-foreground">User</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.kyc_status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => updateKycStatus(user.id, "verified")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateKycStatus(user.id, "rejected")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject KYC
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => toggleAdminStatus(user.id, user.is_admin)}>
                        <Shield className="mr-2 h-4 w-4" />
                        {user.is_admin ? "Remove Admin" : "Make Admin"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
