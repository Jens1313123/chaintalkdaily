import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block bg-[#F0B90B]/10 px-4 py-2 rounded-full text-[#F0B90B] font-medium text-sm mb-6">
            COMING SOON
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">Our Blog is Coming Soon</h1>

          <div className="bg-[#F0B90B]/10 p-6 rounded-full mb-8 inline-block mx-auto">
            <Calendar className="h-12 w-12 text-[#F0B90B]" />
          </div>

          <p className="text-xl text-gray-600 mb-12">
            We're preparing insightful articles and analysis from industry experts about blockchain technology,
            cryptocurrency markets, and educational resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/videos">
              <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 w-full sm:w-auto">
                Explore Videos Instead
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-6 py-3 rounded-lg w-full sm:w-auto">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

