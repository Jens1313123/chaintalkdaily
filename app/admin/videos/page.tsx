"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, Edit, Trash, Eye, Plus, ArrowUpDown, Video } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoData {
  id: string
  title: string
  thumbnail: string
  views: number
  comments: number
  likes: number
  date: string
  status: "published" | "scheduled" | "draft"
  host: string
  duration: string
}

export default function VideosPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [videos, setVideos] = useState<VideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Fetch videos (mock data for demo)
    const fetchVideos = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockVideos: VideoData[] = [
        {
          id: "1",
          title: "CZ's Crypto Education: Understanding Key Concepts",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 24500,
          comments: 342,
          likes: 1820,
          date: "2025-03-22",
          status: "published",
          host: "CZ",
          duration: "22:15",
        },
        {
          id: "2",
          title: "Yi He on Blockchain Technology Basics",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 18200,
          comments: 256,
          likes: 1540,
          date: "2025-03-19",
          status: "published",
          host: "Yi He",
          duration: "18:42",
        },
        {
          id: "3",
          title: "Regulatory Landscape Explained",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 12300,
          comments: 187,
          likes: 980,
          date: "2025-03-10",
          status: "published",
          host: "CZ",
          duration: "24:30",
        },
        {
          id: "4",
          title: "NFT Marketplace Insights",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 0,
          comments: 0,
          likes: 0,
          date: "2025-04-15",
          status: "scheduled",
          host: "Yi He",
          duration: "15:20",
        },
        {
          id: "5",
          title: "Web3 Development",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 0,
          comments: 0,
          likes: 0,
          date: "2025-04-22",
          status: "scheduled",
          host: "CZ",
          duration: "28:15",
        },
        {
          id: "6",
          title: "Crypto Security Best Practices",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 0,
          comments: 0,
          likes: 0,
          date: "2025-05-01",
          status: "draft",
          host: "CZ",
          duration: "19:45",
        },
        {
          id: "7",
          title: "DeFi Explained: Opportunities and Risks",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 11700,
          comments: 156,
          likes: 890,
          date: "2025-02-28",
          status: "published",
          host: "Yi He",
          duration: "26:10",
        },
        {
          id: "8",
          title: "Interview with Blockchain Pioneers",
          thumbnail: "/placeholder.svg?height=720&width=1280",
          views: 8900,
          comments: 124,
          likes: 720,
          date: "2025-02-15",
          status: "published",
          host: "Interview",
          duration: "32:25",
        },
      ]

      setVideos(mockVideos)
      setIsLoading(false)
    }

    fetchVideos()
  }, [isAuthenticated, router])

  const handleDeleteVideo = (video: VideoData) => {
    setSelectedVideo(video)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteVideo = () => {
    if (selectedVideo) {
      // Filter out the deleted video
      const updatedVideos = videos.filter((video) => video.id !== selectedVideo.id)
      setVideos(updatedVideos)

      // Show success toast
      toast({
        title: "Video deleted",
        description: `"${selectedVideo.title}" has been deleted successfully.`,
        variant: "success",
      })

      // Close dialog
      setDeleteDialogOpen(false)
      setSelectedVideo(null)
    }
  }

  const handleEditVideo = (video: VideoData) => {
    // Navigate to edit page
    router.push(`/admin/videos/edit/${video.id}`)
  }

  const handleViewVideo = (video: VideoData) => {
    // In a real app, this would navigate to the public video page
    window.open(`/videos/${video.id}`, "_blank")
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const filteredVideos = videos.filter((video) => {
    // Apply search filter
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.host.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = filterStatus === "all" || video.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "views") {
      return sortOrder === "asc" ? a.views - b.views : b.views - a.views
    } else if (sortBy === "title") {
      return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    }
    return 0
  })

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Videos Management</h1>
            <p className="text-gray-500">Manage and organize your video content</p>
          </div>
          <Link href="/admin/upload">
            <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Upload New Video
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-10 w-full bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Status:{" "}
                  {filterStatus === "all" ? "All" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("published")}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>Scheduled</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} ({sortOrder === "asc" ? "Asc" : "Desc"})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("desc")
                  }}
                >
                  Date (Newest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("asc")
                  }}
                >
                  Date (Oldest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("views")
                    setSortOrder("desc")
                  }}
                >
                  Views (Highest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("views")
                    setSortOrder("asc")
                  }}
                >
                  Views (Lowest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("title")
                    setSortOrder("asc")
                  }}
                >
                  Title (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("title")
                    setSortOrder("desc")
                  }}
                >
                  Title (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="grid" className="mb-6">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <div className="w-full aspect-video bg-gray-100 animate-pulse"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Video className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No videos found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery ? "Try a different search term" : "Upload your first video to get started"}
                </p>
                {!searchQuery && (
                  <Link href="/admin/upload">
                    <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Video
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <Badge
                        variant="outline"
                        className={`absolute top-2 left-2
                          ${video.status === "published" ? "bg-green-50 text-green-600 border-green-200" : ""}
                          ${video.status === "scheduled" ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
                          ${video.status === "draft" ? "bg-gray-50 text-gray-600 border-gray-200" : ""}
                        `}
                      >
                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-base line-clamp-2 mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>{formatNumber(video.views)} views</span>
                        <span>{video.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-gray-50">
                          {video.host}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewVideo(video)}
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditVideo(video)}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteVideo(video)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
                  </div>
                ) : sortedVideos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-100 p-3 rounded-full mb-4">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No videos found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {searchQuery ? "Try a different search term" : "Upload your first video to get started"}
                    </p>
                    {!searchQuery && (
                      <Link href="/admin/upload">
                        <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
                          <Plus className="mr-2 h-4 w-4" />
                          Upload Video
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Video</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Host</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Views</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Duration</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedVideos.map((video) => (
                          <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0">
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
                            <td className="py-3 px-4 text-sm">{video.host}</td>
                            <td className="py-3 px-4 text-sm">{formatNumber(video.views)}</td>
                            <td className="py-3 px-4 text-sm">{video.duration}</td>
                            <td className="py-3 px-4 text-sm">{video.date}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={`
                                  ${video.status === "published" ? "bg-green-50 text-green-600 border-green-200" : ""}
                                  ${video.status === "scheduled" ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
                                  ${video.status === "draft" ? "bg-gray-50 text-gray-600 border-gray-200" : ""}
                                `}
                              >
                                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditVideo(video)}
                                >
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewVideo(video)}
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteVideo(video)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-3">
            <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0">
              <Image
                src={selectedVideo?.thumbnail || "/placeholder.svg"}
                alt={selectedVideo?.title || "Video thumbnail"}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{selectedVideo?.title}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteVideo}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

