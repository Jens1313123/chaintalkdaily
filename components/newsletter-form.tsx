"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, AlertCircle } from "lucide-react"
import { subscribeToNewsletter } from "@/app/actions/subscribe"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus({ success: false, message: "Please provide a valid email address" })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await subscribeToNewsletter(formData)
      setStatus(result)

      if (result.success) {
        setEmail("")

        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus(null)
        }, 5000)
      }
    } catch (error) {
      setStatus({ success: false, message: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F0B90B]/50 focus:border-transparent"
          required
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-4 py-2 rounded-lg font-medium transition-transform hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      {status && (
        <div className={`mt-3 flex items-center ${status.success ? "text-green-600" : "text-red-600"}`}>
          {status.success ? (
            <Check className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}
    </div>
  )
}

