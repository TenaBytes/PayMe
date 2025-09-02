import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Zap, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">WealthNexus</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Invest in <span className="text-primary">Crypto & USDT</span> with Confidence
          </h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Professional cryptocurrency investment platform offering secure staking and high-yield returns on your
            digital assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">
                Start investing <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Sign in to dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose our platform?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for both beginners and experienced investors with enterprise-grade security
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Bank-level Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your investments are protected with military-grade encryption and multi-signature wallets
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>High Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn up to 15.5% APY on your USDT and TRX investments with our optimized staking strategies
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Instant Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start earning immediately with instant deposits and fast transaction processing
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>24/7 Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get help anytime with our dedicated customer support team and comprehensive resources
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Investment Packages Preview */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment packages</h2>
          <p className="text-xl text-muted-foreground">Choose the perfect plan for your investment goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>USDT Starter</CardTitle>
              <CardDescription>Perfect for beginners</CardDescription>
              <div className="text-3xl font-bold text-primary">8.5% APY</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">$100 - $1,000 investment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">30-day term</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Low risk, steady returns</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full w-fit">
                Most Popular
              </div>
              <CardTitle>USDT Growth</CardTitle>
              <CardDescription>Balanced growth package</CardDescription>
              <div className="text-3xl font-bold text-primary">12.0% APY</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">$1,000 - $10,000 investment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">60-day term</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Competitive returns</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>USDT Premium</CardTitle>
              <CardDescription>For experienced investors</CardDescription>
              <div className="text-3xl font-bold text-primary">15.5% APY</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">$10,000+ investment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">90-day term</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">Maximum returns</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/auth/signup">Start investing today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-primary rounded-full p-2">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">WealthNexus</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 WealthNexus Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
