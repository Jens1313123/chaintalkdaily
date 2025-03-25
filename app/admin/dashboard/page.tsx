"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Video,
  Users,
  BarChart,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle2,
  User,
  Menu,
  X,
  Star,
  Home,
  Mail,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useVideoStore, formatViews } from "@/lib/video-service"

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [featuredDialogOpen, setFeaturedDialogOpen] = useState(false)
  const [featuredType, setFeaturedType] = useState<"home" | "videos" | null>(null)

  // Get videos from store
  const videos = useVideoStore((state) => state.getVideos())
  const getVideo = useVideoStore((state) => state.getVideo)
  const deleteVideo = useVideoStore((state) => state.deleteVideo)
  const setFeatured = useVideoStore((state) => state.setFeatured)
  const setFeaturedOnHome = useVideoStore((state) => state.setFeaturedOnHome)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const handleDeleteVideo = (videoId: string) => {
    setSelectedVideo(videoId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteVideo = () => {
    if (selectedVideo) {
      // Delete video from store
      const success = deleteVideo(selectedVideo)

      if (success) {
        // Show success toast
        toast({
          title: "Video deleted",
          description: `The video has been deleted successfully.`,
          variant: "success",
        })
      } else {
        toast({
          title: "Delete failed",
          description: "There was an error deleting the video.",
          variant: "destructive",
        })
      }

      // Close dialog
      setDeleteDialogOpen(false)
      setSelectedVideo(null)
    }
  }

  const handleEditVideo = (videoId: string) => {
    router.push(`/admin/videos/edit/${videoId}`)
  }

  const handleViewVideo = (videoId: string) => {
    const video = getVideo(videoId)
    if (video) {
      window.open(video.videoUrl, "_blank")
    }
  }

  const handleSetFeatured = (videoId: string, type: "home" | "videos") => {
    setSelectedVideo(videoId)
    setFeaturedType(type)
    setFeaturedDialogOpen(true)
  }

  const confirmSetFeatured = () => {
    if (selectedVideo && featuredType) {
      let success = false

      if (featuredType === "home") {
        success = setFeaturedOnHome(selectedVideo, true)
      } else if (featuredType === "videos") {
        success = setFeatured(selectedVideo, true)
      }

      if (success) {
        toast({
          title: "Video featured",
          description: `The video is now featured on the ${featuredType === "home" ? "home" : "videos"} page.`,
          variant: "success",
        })
      } else {
        toast({
          title: "Operation failed",
          description: "There was an error featuring the video.",
          variant: "destructive",
        })
      }

      setFeaturedDialogOpen(false)
      setSelectedVideo(null)
      setFeaturedType(null)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
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

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  // Mobile menu content
  const MobileMenuContent = (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 pb-4 px-4 pt-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="ChainTalkDaily Logo" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-bold text-black">Admin Panel</span>
        </div>
        <SheetClose className="rounded-full p-2 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </SheetClose>
      </div>

      <div className="px-4 space-y-1 flex-1 overflow-auto">
        <SheetClose asChild>
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("dashboard")}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant={activeTab === "videos" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("videos")}
          >
            <Video className="h-5 w-5 mr-3" />
            Videos
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("users")}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("analytics")}
          >
            <BarChart className="h-5 w-5 mr-3" />
            Analytics
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("settings")}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant={activeTab === "subscribers" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleTabChange("subscribers")}
          >
            <Mail className="h-5 w-5 mr-3" />
            Subscribers
          </Button>
        </SheetClose>
      </div>

      <div className="mt-auto pt-4 px-4 border-t border-gray-200 space-y-3">
        <SheetClose asChild>
          <Link href="/admin/upload" className="w-full">
            <Button className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
              <Plus className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SheetClose>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 border-r border-gray-200 bg-white hidden md:block">
          <div className="border-b border-gray-200 h-16 flex items-center px-6">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="ChainTalkDaily Logo" width={32} height={32} className="rounded-full" />
              <span className="text-lg font-bold text-black">Admin Panel</span>
            </div>
          </div>

          <div className="p-4 space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("dashboard")}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "videos" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("videos")}
            >
              <Video className="h-5 w-5 mr-3" />
              Videos
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("users")}
            >
              <Users className="h-5 w-5 mr-3" />
              Users
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("analytics")}
            >
              <BarChart className="h-5 w-5 mr-3" />
              Analytics
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("settings")}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>
            <Button
              variant={activeTab === "subscribers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("subscribers")}
            >
              <Mail className="h-5 w-5 mr-3" />
              Subscribers
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 w-64 border-t border-gray-200 p-4">
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[270px] sm:w-[300px] p-0">
                  {MobileMenuContent}
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl font-bold text-black truncate">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "videos" && "Videos Management"}
              {activeTab === "users" && "User Management"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "subscribers" && "Subscribers"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {!isMobile && (
              <Link href="/admin/upload">
                <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Image
                    src="/placeholder.svg?height=100&width=100"
                    alt="Admin"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                {isMobile && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/upload" className="flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Video
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Videos</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1">{videos.length}</h3>
                        <p className="text-xs text-green-500 mt-1">+2 this week</p>
                      </div>
                      <div className="bg-[#F0B90B]/10 p-2 md:p-3 rounded-full">
                        <Video className="h-5 w-5 md:h-6 md:w-6 text-[#F0B90B]" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1">
                          {formatViews(videos.reduce((sum, video) => sum + video.views, 0))}
                        </h3>
                        <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                      </div>
                      <div className="bg-[#F0B90B]/10 p-2 md:p-3 rounded-full">
                        <Eye className="h-5 w-5 md:h-6 md:w-6 text-[#F0B90B]" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Comments</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1">
                          {formatViews(videos.reduce((sum, video) => sum + video.comments, 0))}
                        </h3>
                        <p className="text-xs text-green-500 mt-1">+8% from last month</p>
                      </div>
                      <div className="bg-[#F0B90B]/10 p-2 md:p-3 rounded-full">
                        <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-[#F0B90B]" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Growth</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1">+24%</h3>
                        <p className="text-xs text-green-500 mt-1">+5% from last month</p>
                      </div>
                      <div className="bg-[#F0B90B]/10 p-2 md:p-3 rounded-full">
                        <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-[#F0B9কিন্তor]" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured Videos Management */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Featured Videos</CardTitle>
                    <CardDescription>Manage which videos appear on the home and videos pages</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Home Page Featured</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videos
                            .filter((v) => v.isFeaturedOnHome)
                            .map((video) => (
                              <div
                                key={video.id}
                                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                              >
                                <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={video.thumbnail || "/placeholder.svg"}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium truncate">{video.title}</h4>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span>{formatViews(video.views)} views</span>
                                    <span className="mx-1">•</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-600 border-green-200"
                                    >
                                      Featured
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => setFeaturedOnHome(video.id, false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Videos Page Featured</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {videos
                            .filter((v) => v.featured)
                            .map((video) => (
                              <div
                                key={video.id}
                                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                              >
                                <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={video.thumbnail || "/placeholder.svg"}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium truncate">{video.title}</h4>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <span>{formatViews(video.views)} views</span>
                                    <span className="mx-1">•</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200"
                                    >
                                      Featured
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500"
                                  onClick={() => setFeatured(video.id, false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-medium text-sm md:text-base">Video Published</h4>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                            "CZ's Crypto Education: Understanding Key Concepts" has been published
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                          <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-medium text-sm md:text-base">Video Scheduled</h4>
                            <span className="text-xs text-gray-500">5 hours ago</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                            "NFT Marketplace Insights" has been scheduled for April 15, 2025
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                          <Edit className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-medium text-sm md:text-base">Video Updated</h4>
                            <span className="text-xs text-gray-500">Yesterday</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                            "Regulatory Landscape Explained" has been updated with new content
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                          <Trash className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="font-medium text-sm md:text-base">Video Deleted</h4>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            "Introduction to DeFi" has been deleted
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Video Status</CardTitle>
                      <CardDescription>Overview of your video library</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Published</span>
                          <span className="text-sm font-medium">
                            {videos.filter((v) => v.status === "published").length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{
                              width: `${(videos.filter((v) => v.status === "published").length / videos.length) * 100}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Scheduled</span>
                          <span className="text-sm font-medium">
                            {videos.filter((v) => v.status === "scheduled").length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full"
                            style={{
                              width: `${(videos.filter((v) => v.status === "scheduled").length / videos.length) * 100}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Drafts</span>
                          <span className="text-sm font-medium">
                            {videos.filter((v) => v.status === "draft").length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gray-500 h-2.5 rounded-full"
                            style={{
                              width: `${(videos.filter((v) => v.status === "draft").length / videos.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Top Performing Videos</CardTitle>
                      <CardDescription>Videos with the most views</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        {videos
                          .filter((v) => v.status === "published")
                          .sort((a, b) => b.views - a.views)
                          .slice(0, 3)
                          .map((video, index) => (
                            <div key={video.id} className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F0B90B]/10 flex items-center justify-center text-[#F0B90B] font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate">{video.title}</h4>
                                <p className="text-xs text-gray-500">{formatViews(video.views)} views</p>
                              </div>
                              <div className="flex-shrink-0 text-sm font-medium text-green-500">
                                +{Math.floor(Math.random() * 15) + 5}%
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscriber Stats */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Recent Subscribers</CardTitle>
                    <CardDescription>Latest newsletter signups</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Subscribers</span>
                        <span className="text-sm font-medium">12,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#F0B90B] h-2.5 rounded-full" style={{ width: "100%" }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">New This Week</span>
                        <span className="text-sm font-medium">156</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Open Rate</span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link href="/admin/subscribers">
                        <Button variant="outline" className="w-full">
                          View All Subscribers
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search videos..."
                        className="pl-10 w-full bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                          <Filter className="h-4 w-4" />
                          <span className="truncate">
                            Status:{" "}
                            {filterStatus === "all"
                              ? "All"
                              : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                          </span>
                          <ChevronDown className="h-4 w-4 ml-auto" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("published")}>Published</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>Scheduled</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Draft</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Link href="/admin/upload" className="w-full sm:w-auto">
                    <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload New Video
                    </Button>
                  </Link>
                </div>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
                      </div>
                    ) : filteredVideos.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-gray-100 p-3 rounded-full mb-4">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No videos found</h3>
                        <p className="text-sm text-gray-500 mb-4 text-center px-4">
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
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden sm:table-cell">
                                Host
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                                Views
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden lg:table-cell">
                                Comments
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 hidden md:table-cell">
                                Date
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredVideos.map((video) => (
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
                                <td className="py-3 px-4 text-sm hidden sm:table-cell">{video.host}</td>
                                <td className="py-3 px-4 text-sm hidden md:table-cell">{formatViews(video.views)}</td>
                                <td className="py-3 px-4 text-sm hidden lg:table-cell">
                                  {formatViews(video.comments)}
                                </td>
                                <td className="py-3 px-4 text-sm hidden md:table-cell">{video.date}</td>
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
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Star className="h-4 w-4 text-gray-500" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleSetFeatured(video.id, "videos")}>
                                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                                          Feature on Videos Page
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSetFeatured(video.id, "home")}>
                                          <Home className="h-4 w-4 mr-2 text-blue-500" />
                                          Feature on Home Page
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleEditVideo(video.id)}
                                    >
                                      <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleViewVideo(video.id)}
                                    >
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleDeleteVideo(video.id)}
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
              </div>
            )}

            {/* Other tabs would go here */}
          </div>
        </main>
      </div>

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
                src={getVideo(selectedVideo || "")?.thumbnail || "/placeholder.svg"}
                alt={getVideo(selectedVideo || "")?.title || "Video thumbnail"}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{getVideo(selectedVideo || "")?.title}</span>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteVideo} className="w-full sm:w-auto">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature Confirmation Dialog */}
      <Dialog open={featuredDialogOpen} onOpenChange={setFeaturedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature Video</DialogTitle>
            <DialogDescription>
              {featuredType === "home"
                ? "This video will be featured on the home page. Continue?"
                : "This video will be featured on the videos page. Continue?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-3">
            <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0">
              <Image
                src={getVideo(selectedVideo || "")?.thumbnail || "/placeholder.svg"}
                alt={getVideo(selectedVideo || "")?.title || "Video thumbnail"}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{getVideo(selectedVideo || "")?.title}</span>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setFeaturedDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black w-full sm:w-auto"
              onClick={confirmSetFeatured}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

