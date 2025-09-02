"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface InvestmentModalProps {
  package: any
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InvestmentModal({ package: pkg, isOpen, onClose, onSuccess }: InvestmentModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pkg) return

    const investmentAmount = Number(amount)
    if (investmentAmount < pkg.min_amount || (pkg.max_amount && investmentAmount > pkg.max_amount)) {
      setError(`Amount must be between $${pkg.min_amount} and $${pkg.max_amount || "unlimited"}`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      // Calculate expected return
      const dailyRate = pkg.apy_rate / 365 / 100
      const expectedReturn = investmentAmount * (1 + dailyRate * pkg.duration_days) - investmentAmount

      // Create investment
      const { error: investmentError } = await supabase.from("investments").insert({
        user_id: user.id,
        package_id: pkg.id,
        amount: investmentAmount,
        currency: pkg.currency,
        end_date: new Date(Date.now() + pkg.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        expected_return: expectedReturn,
      })

      if (investmentError) throw investmentError

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "investment",
        amount: investmentAmount,
        currency: pkg.currency,
        status: "completed",
        description: `Investment in ${pkg.name}`,
        processed_at: new Date().toISOString(),
      })

      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!pkg) return null

  const expectedReturn = Number(amount) * (pkg.apy_rate / 100) * (pkg.duration_days / 365)
  const totalReturn = Number(amount) + expectedReturn

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in {pkg.name}</DialogTitle>
          <DialogDescription>
            {pkg.apy_rate}% APY • {pkg.duration_days} days • {pkg.currency}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount ({pkg.currency})</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Min: $${pkg.min_amount}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={pkg.min_amount}
              max={pkg.max_amount}
              step="0.01"
              required
            />
            <p className="text-xs text-muted-foreground">
              Range: ${pkg.min_amount.toLocaleString()} - $
              {pkg.max_amount ? pkg.max_amount.toLocaleString() : "unlimited"}
            </p>
          </div>

          {amount && Number(amount) >= pkg.min_amount && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Investment Amount:</span>
                <span>${Number(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expected Return:</span>
                <span className="text-green-600">+${expectedReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total at Maturity:</span>
                <span>${totalReturn.toLocaleString()}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !amount || Number(amount) < pkg.min_amount}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Investment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
