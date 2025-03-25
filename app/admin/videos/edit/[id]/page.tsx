"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Calendar, Tag, Clock, Save, Trash, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useVideoStore, videoCategories } from "@/lib/video-service"

export default function EditVideoPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [scheduleRelease, setScheduleRelease] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    host: "",
    category: "",
    tags: "",
    duration: "",
    status: "published" as "published" | "scheduled" | "draft",
    date: "",
    featured: false,
    isFeaturedOnHome: false,
  })

  // Get video store functions
  const getVideo = useVideoStore((state) => state.getVideo)
  const updateVideo = useVideoStore((state) => state.updateVideo)
  const deleteVideo = useVideoStore((state) => state.deleteVideo)

  // File input refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
      return
    }

    const videoId = params.id as string

    // Fetch video data
    const video = getVideo(videoId)

    if (video) {
      setFormData({
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        videoUrl: video.videoUrl,
        host: video.host,
        category: video.category,
        tags: video.tags.join(", "),
        duration: video.duration,
        status: video.status,
        date: video.date,
        featured: video.featured,
        isFeaturedOnHome: video.isFeaturedOnHome,
      })
      setThumbnailPreview(video.thumbnail)
      setScheduleRelease(video.status === "scheduled")
    } else {
      toast({
        title: "Video not found",
        description: "The requested video could not be found.",
        variant: "destructive",
      })
      router.push("/admin/dashboard")
    }

    setIsLoading(false)
  }, [isAuthenticated, params.id, router, toast, getVideo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailPreview(reader.result as string)
        setFormData({ ...formData, thumbnail: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      // In a real app, you would upload this file to a server and get a URL back
      // For now, we'll just update the form data with a mock URL
      setFormData({ ...formData, videoUrl: `/videos/${file.name.toLowerCase().replace(/\s+/g, "-")}` })

      toast({
        title: "Video selected",
        description: `${file.name} will be uploaded when you save changes.`,
        variant: "default",
      })
    }
  }

  const handleStatusChange = (status: "published" | "scheduled" | "draft") => {
    setFormData({ ...formData, status })
    if (status === "scheduled") {
      setScheduleRelease(true)
    } else {
      setScheduleRelease(false)
    }
  }

  const handleFeaturedChange = (featured: boolean) => {
    setFormData({ ...formData, featured })
  }

  const handleFeaturedOnHomeChange = (featured: boolean) => {
    setFormData({ ...formData, isFeaturedOnHome: featured })
  }

  // Update the handleSave function to ensure changes propagate throughout the application
  const handleSave = async () => {
    if (!formData) return

    setIsSaving(true)

    try {
      // Process tags
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      // Update video in store
      const success = updateVideo(params.id as string, {
        ...formData,
        tags,
      })

      if (success) {
        toast({
          title: "Video updated successfully",
          description: scheduleRelease
            ? `Your video has been scheduled for release on ${formData.date}`
            : "Your video has been updated",
          variant: "success",
        })

        // Force a refresh of the video store to ensure changes propagate
        // This will trigger re-renders in components that use the video data
        const updatedVideo = getVideo(params.id as string)

        router.push("/admin/dashboard")
      } else {
        throw new Error("Failed to update video")
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your video",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsSaving(true)

    try {
      const success = deleteVideo(params.id as string)

      if (success) {
        toast({
          title: "Video deleted",
          description: "The video has been deleted successfully",
          variant: "success",
        })

        router.push("/admin/dashboard")
      } else {
        throw new Error("Failed to delete video")
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your video",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
      setDeleteDialogOpen(false)
    }
  }

  const handlePreview = () => {
    // In a real app, this would navigate to the public video page
    window.open(`/videos/${params.id}`, "_blank")
  }

  const triggerThumbnailUpload = () => {
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.click()
    }
  }

  const triggerVideoUpload = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

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
            <h1 className="text-xl font-bold text-black">Edit Video</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={handlePreview} disabled={isLoading}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isLoading || isSaving}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
            <Button
              className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black flex items-center gap-2"
              onClick={handleSave}
              disabled={isLoading || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Information</CardTitle>
                    <CardDescription>Edit the details about your video</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Video Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter video description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="host">Host</Label>
                        <Select value={formData.host} onValueChange={(value) => handleSelectChange("host", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select host" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CZ">CZ</SelectItem>
                            <SelectItem value="Yi He">Yi He</SelectItem>
                            <SelectItem value="Panel">Panel Discussion</SelectItem>
                            <SelectItem value="Interview">Interview</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {videoCategories
                              .filter((c) => c.value !== "all")
                              .map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="Enter tags separated by commas"
                          value={formData.tags}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="duration"
                            name="duration"
                            placeholder="e.g. 22:15"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="scheduleRelease">Schedule Release</Label>
                          <Switch
                            id="scheduleRelease"
                            checked={scheduleRelease}
                            onCheckedChange={(checked) => {
                              setScheduleRelease(checked)
                              handleStatusChange(checked ? "scheduled" : "published")
                            }}
                          />
                        </div>
                        {scheduleRelease && (
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className="pl-10"
                              required={scheduleRelease}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="featured">Featured on Videos Page</Label>
                          <Switch id="featured" checked={formData.featured} onCheckedChange={handleFeaturedChange} />
                        </div>
                        <p className="text-xs text-gray-500">Featured videos appear at the top of the videos page</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="featuredOnHome">Featured on Home Page</Label>
                          <Switch
                            id="featuredOnHome"
                            checked={formData.isFeaturedOnHome}
                            onCheckedChange={handleFeaturedOnHomeChange}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Featured videos appear in the main section of the home page
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Video File</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerVideoUpload}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {videoFile ? "Change Video File" : "Upload Video File"}
                        </Button>
                        <Input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoChange}
                        />
                        {videoFile && <span className="text-sm text-gray-500">Selected: {videoFile.name}</span>}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.videoUrl ? `Current video: ${formData.videoUrl}` : "No video file currently uploaded"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Video Statistics</CardTitle>
                    <CardDescription>View performance metrics for this video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Views</p>
                        <p className="text-xl font-bold">
                          {getVideo(params.id as string)?.views.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Comments</p>
                        <p className="text-xl font-bold">
                          {getVideo(params.id as string)?.comments.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Likes</p>
                        <p className="text-xl font-bold">
                          {getVideo(params.id as string)?.likes.toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                    <CardDescription>Update the thumbnail for your video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                        {thumbnailPreview ? (
                          <Image
                            src={thumbnailPreview || "/placeholder.svg"}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 text-sm">No thumbnail selected</p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerThumbnailUpload}
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Thumbnail
                        </Button>
                        <Input
                          ref={thumbnailInputRef}
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Recommended size: 1280x720 pixels (16:9 ratio)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publish Settings</CardTitle>
                    <CardDescription>Configure your video's visibility</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={formData.status === "published" ? "default" : "outline"}
                          className={formData.status === "published" ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleStatusChange("published")}
                        >
                          Published
                        </Button>
                        <Button
                          variant={formData.status === "scheduled" ? "default" : "outline"}
                          className={formData.status === "scheduled" ? "bg-blue-600 hover:bg-blue-700" : ""}
                          onClick={() => handleStatusChange("scheduled")}
                        >
                          Scheduled
                        </Button>
                        <Button
                          variant={formData.status === "draft" ? "default" : "outline"}
                          className={formData.status === "draft" ? "bg-gray-600 hover:bg-gray-700" : ""}
                          onClick={() => handleStatusChange("draft")}
                        >
                          Draft
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <Select defaultValue="public">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="comments">Enable Comments</Label>
                        <Switch id="comments" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button
                      onClick={handleSave}
                      className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/admin/dashboard")}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </main>

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
                src={thumbnailPreview || "/placeholder.svg"}
                alt={formData.title || "Video thumbnail"}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{formData.title}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSaving}>
              {isSaving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

