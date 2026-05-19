"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BusinessSuccess() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Business Submitted Successfully!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your business has been submitted and is waiting for admin approval. You will be notified once it's approved.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Status: Pending Approval
        </div>
        
        <div className="space-y-3">
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/add-business")}
            className="w-full"
          >
            Add Another Business
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    </div>
  )
}
