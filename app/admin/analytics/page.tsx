"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import {
  Download,
  TrendingUp,
  Users,
  Eye,
  Clock,
  MessageSquare,
  ThumbsUp,
  BarChart,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Share2,
} from "lucide-react"
import Image from "next/image"

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Analytics Dashboard</h1>
            <p className="text-gray-500">Track performance metrics and audience engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Views</p>
                    <h3 className="text-2xl font-bold mt-1">156.2K</h3>
                    <div className="flex items-center text-xs text-green-500 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+12.5% from last period</span>
                    </div>
                  </div>
                  <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Watch Time</p>
                    <h3 className="text-2xl font-bold mt-1">4,328 hrs</h3>
                    <div className="flex items-center text-xs text-green-500 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+8.3% from last period</span>
                    </div>
                  </div>
                  <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Engagement</p>
                    <h3 className="text-2xl font-bold mt-1">8.7%</h3>
                    <div className="flex items-center text-xs text-red-500 mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>-2.1% from last period</span>
                    </div>
                  </div>
                  <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subscribers</p>
                    <h3 className="text-2xl font-bold mt-1">12.4K</h3>
                    <div className="flex items-center text-xs text-green-500 mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>+15.8% from last period</span>
                    </div>
                  </div>
                  <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-[#F0B90B]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Views & Watch Time</CardTitle>
                  <CardDescription>Performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50">
                      <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,200 Q200,100 400,200 T800,200" fill="none" stroke="#F0B90B" strokeWidth="2" />
                        <path d="M0,250 Q200,150 400,250 T800,250" fill="none" stroke="#94A3B8" strokeWidth="2" />
                      </svg>
                    </div>
                    <LineChart className="h-12 w-12 text-gray-300" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Viewer age and location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50">
                      <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        <circle
                          cx="200"
                          cy="200"
                          r="150"
                          fill="none"
                          stroke="#F0B90B"
                          strokeWidth="50"
                          strokeDasharray="471, 943"
                        />
                        <circle
                          cx="200"
                          cy="200"
                          r="100"
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="50"
                          strokeDasharray="314, 628"
                        />
                        <circle
                          cx="200"
                          cy="200"
                          r="50"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="50"
                          strokeDasharray="157, 314"
                        />
                      </svg>
                    </div>
                    <PieChart className="h-12 w-12 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <Tabs defaultValue="performance" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Videos</CardTitle>
                    <CardDescription>Videos with the highest views and engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Video</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Watch Time</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                              Avg. View Duration
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">CTR</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Engagement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              title: "CZ's Crypto Education: Understanding Key Concepts",
                              thumbnail: "/placeholder.svg?height=720&width=1280",
                              views: "24.5K",
                              watchTime: "1,245 hrs",
                              avgDuration: "3:05",
                              ctr: "8.2%",
                              engagement: "12.4%",
                            },
                            {
                              title: "Yi He on Blockchain Technology Basics",
                              thumbnail: "/placeholder.svg?height=720&width=1280",
                              views: "18.2K",
                              watchTime: "985 hrs",
                              avgDuration: "3:15",
                              ctr: "7.8%",
                              engagement: "10.2%",
                            },
                            {
                              title: "Regulatory Landscape Explained",
                              thumbnail: "/placeholder.svg?height=720&width=1280",
                              views: "12.3K",
                              watchTime: "745 hrs",
                              avgDuration: "3:38",
                              ctr: "6.9%",
                              engagement: "9.5%",
                            },
                            {
                              title: "DeFi Explained: Opportunities and Risks",
                              thumbnail: "/placeholder.svg?height=720&width=1280",
                              views: "11.7K",
                              watchTime: "682 hrs",
                              avgDuration: "3:30",
                              ctr: "7.1%",
                              engagement: "8.9%",
                            },
                            {
                              title: "Interview with Blockchain Pioneers",
                              thumbnail: "/placeholder.svg?height=720&width=1280",
                              views: "8.9K",
                              watchTime: "671 hrs",
                              avgDuration: "4:32",
                              ctr: "5.8%",
                              engagement: "11.2%",
                            },
                          ].map((video, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-7 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                      src={video.thumbnail || "/placeholder.svg"}
                                      alt={video.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="font-medium text-sm line-clamp-1">{video.title}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm">{video.views}</td>
                              <td className="py-3 px-4 text-sm">{video.watchTime}</td>
                              <td className="py-3 px-4 text-sm">{video.avgDuration}</td>
                              <td className="py-3 px-4 text-sm">{video.ctr}</td>
                              <td className="py-3 px-4 text-sm">{video.engagement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Age Demographics</CardTitle>
                      <CardDescription>Viewer age distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 opacity-50">
                          <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                            <rect x="50" y="250" width="40" height="30" fill="#F0B90B" />
                            <rect x="100" y="200" width="40" height="80" fill="#F0B90B" />
                            <rect x="150" y="150" width="40" height="130" fill="#F0B90B" />
                            <rect x="200" y="100" width="40" height="180" fill="#F0B90B" />
                            <rect x="250" y="150" width="40" height="130" fill="#F0B90B" />
                            <rect x="300" y="200" width="40" height="80" fill="#F0B90B" />
                          </svg>
                        </div>
                        <BarChart className="h-12 w-12 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                      <CardDescription>Top viewer locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { country: "United States", percentage: 32 },
                          { country: "United Kingdom", percentage: 18 },
                          { country: "Canada", percentage: 14 },
                          { country: "Australia", percentage: 9 },
                          { country: "Germany", percentage: 7 },
                          { country: "Other", percentage: 20 },
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{item.country}</span>
                              <span className="text-sm text-gray-500">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#F0B90B] h-2 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                    <CardDescription>Comments, likes, and shares over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 opacity-50">
                        <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0,300 Q100,200 200,250 T400,200 T600,250 T800,200"
                            fill="none"
                            stroke="#F0B90B"
                            strokeWidth="3"
                          />
                          <path
                            d="M0,350 Q100,300 200,320 T400,280 T600,320 T800,280"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="3"
                          />
                          <path
                            d="M0,250 Q100,150 200,180 T400,150 T600,180 T800,150"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                      <LineChart className="h-12 w-12 text-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-5 w-5 text-[#F0B90B]" />
                          <span className="font-medium">Comments</span>
                        </div>
                        <p className="text-2xl font-bold">2,845</p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +18.5% from last period
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ThumbsUp className="h-5 w-5 text-[#F0B90B]" />
                          <span className="font-medium">Likes</span>
                        </div>
                        <p className="text-2xl font-bold">15,320</p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +22.3% from last period
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="h-5 w-5 text-[#F0B90B]" />
                          <span className="font-medium">Shares</span>
                        </div>
                        <p className="text-2xl font-bold">4,128</p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +15.7% from last period
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revenue">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monetization performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 opacity-50">
                        <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0,350 Q200,250 400,300 T800,200" fill="none" stroke="#F0B90B" strokeWidth="3" />
                          <path d="M0,350 L800,350" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                          <path d="M0,300 L800,300" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                          <path d="M0,250 L800,250" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                          <path d="M0,200 L800,200" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                          <path d="M0,150 L800,150" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                          <path d="M0,100 L800,100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                        </svg>
                      </div>
                      <TrendingUp className="h-12 w-12 text-gray-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold">$12,845.32</p>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          +8.7% from last period
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Revenue per View</p>
                        <p className="text-2xl font-bold">$0.082</p>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          -2.3% from last period
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </motion.div>
    </div>
  )
}

