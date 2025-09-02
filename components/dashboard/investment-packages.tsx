"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { InvestmentModal } from "./investment-modal"

interface InvestmentPackage {
  id: string
  name: string
  description: string
  min_amount: number
  max_amount: number
  apy_rate: number
  duration_days: number
  currency: string
}

export function InvestmentPackages() {
  const [packages, setPackages] = useState<InvestmentPackage[]>([])
  const [selectedPackage, setSelectedPackage] = useState<InvestmentPackage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPackages = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("investment_packages").select("*").eq("is_active", true)
      setPackages(data || [])
      setIsLoading(false)
    }

    fetchPackages()
  }, [])

  const handleInvest = (pkg: InvestmentPackage) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Packages</CardTitle>
          <CardDescription>Loading available packages...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Investment Packages</CardTitle>
          <CardDescription>Choose from our curated investment options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {pkg.apy_rate}% APY
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Min Amount</p>
                  <p className="font-medium">${pkg.min_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{pkg.duration_days} days</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Currency</p>
                  <p className="font-medium">{pkg.currency}</p>
                </div>
              </div>

              <Button onClick={() => handleInvest(pkg)} className="w-full" size="sm">
                Invest Now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <InvestmentModal
        package={selectedPackage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          // Refresh the page or update state
          window.location.reload()
        }}
      />
    </>
  )
}
