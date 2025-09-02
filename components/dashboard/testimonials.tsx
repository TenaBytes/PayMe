"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
  story: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Business Owner",
    content:
      "WealthNexus has transformed my financial future. The returns are consistent and the platform is incredibly user-friendly.",
    rating: 5,
    avatar: "/professional-woman-smiling.png",
    story:
      "Started with a small investment of $1,000 and now manages a portfolio worth over $50,000. Sarah's success story began when she decided to diversify her business profits into cryptocurrency investments.",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Software Engineer",
    content:
      "The transparency and security of this platform gives me complete confidence in my investments. Excellent customer support too!",
    rating: 5,
    avatar: "/asian-professional-man.png",
    story:
      "A tech professional who appreciated the platform's security features. Michael's analytical approach to investing helped him achieve a 45% return on his initial investment within the first year.",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Marketing Director",
    content:
      "I've tried many investment platforms, but none compare to the reliability and profitability of WealthNexus.",
    rating: 5,
    avatar: "/latina-professional-woman.png",
    story:
      "Emma's marketing background helped her recognize the platform's potential early on. She started investing during the beta phase and has seen consistent monthly returns that now supplement her salary.",
  },
  {
    id: "4",
    name: "David Thompson",
    role: "Retired Teacher",
    content: "Perfect for retirement planning. The steady returns help supplement my pension beautifully.",
    rating: 5,
    avatar: "/older-man-smiling.png",
    story:
      "After retiring from 30 years of teaching, David was looking for ways to grow his pension. His conservative investment approach with WealthNexus has provided him with the financial security he needed for his golden years.",
  },
  {
    id: "5",
    name: "Lisa Park",
    role: "Healthcare Worker",
    content:
      "As a busy healthcare professional, I needed something simple yet profitable. This platform delivers on both fronts.",
    rating: 5,
    avatar: "/asian-woman-healthcare-worker.png",
    story:
      "Working long shifts as a nurse, Lisa needed a passive investment solution. The automated features and consistent returns have allowed her to build wealth while focusing on her demanding career in healthcare.",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Small Business Owner",
    content: "The best investment decision I've made for my business. The returns help fund expansion and growth.",
    rating: 5,
    avatar: "/businessman-confident.png",
    story:
      "James used his business profits to invest in WealthNexus and reinvested the returns back into expanding his local restaurant chain. His strategic approach has helped him open three new locations in the past two years.",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Stories</CardTitle>
        <CardDescription>Real stories from our successful investors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Floating testimonial */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{testimonial.role}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-foreground mb-4 italic">"{testimonial.content}"</blockquote>
                        <div className="bg-background/50 rounded-md p-3 border-l-4 border-primary">
                          <p className="text-sm text-muted-foreground">
                            <strong>Success Story:</strong> {testimonial.story}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
