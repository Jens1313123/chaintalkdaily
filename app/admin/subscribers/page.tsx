"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Download, Trash, RefreshCw } from "lucide-react"

// Initialize Supabase client with your credentials
const supabaseUrl = "https://zyjwprlkrhmwjowwuukd.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5andwcmxrcmhtd2pvd3d1dWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDgzODcsImV4cCI6MjA1ODQ4NDM4N30.CO07uvOR_9HIQp9junOQeAoXB4bOhlsEOYheecCIZfk"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Subscriber {
  id: number
  email: string
  subscribed_at: string
}

export default function SubscribersPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    fetchSubscribers()
  }, [isAuthenticated, router])

  const fetchSubscribers = async () => {
    setIsLoading(true)
    try {
      // Get total count
      const { count } = await supabase.from("subscribers").select("*", { count: "exact", head: true })

      setTotalCount(count || 0)

      // Get subscribers
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false })

      if (error) {
        console.error("Error fetching subscribers:", error)
        return
      }

      setSubscribers(data as Subscriber[])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = () => {
    // Filter subscribers if search is active
    const dataToExport = searchQuery
      ? subscribers.filter((sub) => sub.email.toLowerCase().includes(searchQuery.toLowerCase()))
      : subscribers

    // Create CSV content
    const csvContent = [
      ["ID", "Email", "Subscribed At"],
      ...dataToExport.map((sub) => [sub.id, sub.email, new Date(sub.subscribed_at).toLocaleString()]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `subscribers_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter subscribers based on search
  const filteredSubscribers = searchQuery
    ? subscribers.filter((sub) => sub.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : subscribers

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Email Subscribers</h1>
          <p className="text-gray-500">Manage your newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSubscribers} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search subscribers..."
            className="pl-10 w-full bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscribers</CardTitle>
          <div className="text-sm text-gray-500">Total: {totalCount}</div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <Trash className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No subscribers found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery ? "Try a different search term" : "You don't have any subscribers yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{subscriber.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{subscriber.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(subscriber.subscribed_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

