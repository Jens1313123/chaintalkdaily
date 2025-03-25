"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useVideoStore } from "@/lib/video-service"

export default function ManageVideosPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Get videos and update function from the store
  const videos = useVideoStore((state) => state.videos)
  const updateVideo = useVideoStore((state) => state.updateVideo)

  // Create a state to track edited videos
  const [editedVideos, setEditedVideos] = useState<Record<string, { title: string; description: string }>>({})

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    // Initialize editedVideos with current video data
    const initialEdits: Record<string, { title: string; description: string }> = {}
    videos.forEach((video) => {
      initialEdits[video.id] = {
        title: video.title,
        description: video.description,
      }
    })
    setEditedVideos(initialEdits)
    setIsLoading(false)
  }, [isAuthenticated, router, videos])

  // Handle input changes
  const handleInputChange = (videoId: string, field: "title" | "description", value: string) => {
    setEditedVideos((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        [field]: value,
      },
    }))
  }

  // Save all changes
  const handleSaveAll = async () => {
    setIsSaving(true)

    try {
      // Update each edited video
      Object.entries(editedVideos).forEach(([videoId, data]) => {
        updateVideo(videoId, {
          title: data.title,
          description: data.description,
        })
      })

      toast({
        title: "Changes saved",
        description: "All video information has been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was a problem updating the videos.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-[#F0B90B]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-black">Manage All Videos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black flex items-center gap-2"
              onClick={handleSaveAll}
              disabled={isLoading || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search videos..."
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="relative w-16 h-9 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>Video ID: {video.id}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`title-${video.id}`} className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <Input
                        id={`title-${video.id}`}
                        value={editedVideos[video.id]?.title || ""}
                        onChange={(e) => handleInputChange(video.id, "title", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor={`description-${video.id}`} className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Textarea
                        id={`description-${video.id}`}
                        value={editedVideos[video.id]?.description || ""}
                        onChange={(e) => handleInputChange(video.id, "description", e.target.value)}
                        className="w-full"
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Link href={`/admin/videos/edit/${video.id}`}>
                        <Button variant="outline" size="sm">
                          Edit Full Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-1">No videos found</h3>
                <p className="text-sm text-gray-500">Try a different search term</p>
              </div>
            )}

            {filteredVideos.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

