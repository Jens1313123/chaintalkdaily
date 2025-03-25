"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowLeft, Upload, Calendar, Tag, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UploadVideoPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [scheduleRelease, setScheduleRelease] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    host: "CZ",
    category: "educational",
    tags: "",
    releaseDate: "",
    duration: "",
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Video uploaded successfully",
        description: scheduleRelease
          ? `Your video has been scheduled for release on ${formData.releaseDate}`
          : "Your video has been published",
        variant: "success",
      })

      router.push("/admin/dashboard")
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <h1 className="text-xl font-bold text-black">Upload New Video</h1>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
              alt="ChainTalkDaily Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium">Admin Panel</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Information</CardTitle>
                    <CardDescription>Enter the details about your video</CardDescription>
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
                            <SelectItem value="educational">Educational</SelectItem>
                            <SelectItem value="market-analysis">Market Analysis</SelectItem>
                            <SelectItem value="regulatory">Regulatory</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
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
                          <Switch id="scheduleRelease" checked={scheduleRelease} onCheckedChange={setScheduleRelease} />
                        </div>
                        {scheduleRelease && (
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="releaseDate"
                              name="releaseDate"
                              type="date"
                              value={formData.releaseDate}
                              onChange={handleInputChange}
                              className="pl-10"
                              required={scheduleRelease}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Video Upload</CardTitle>
                    <CardDescription>Upload your video file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag and drop your video file</h3>
                      <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                      <Button type="button" variant="outline">
                        Select Video File
                      </Button>
                      <p className="text-xs text-gray-400 mt-4">
                        Supported formats: MP4, MOV, AVI, WebM. Maximum file size: 2GB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                    <CardDescription>Upload a thumbnail for your video</CardDescription>
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
                        <Label
                          htmlFor="thumbnail"
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Thumbnail
                          <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailChange}
                          />
                        </Label>
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
                      type="submit"
                      className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                      disabled={isLoading}
                    >
                      {isLoading ? "Uploading..." : scheduleRelease ? "Schedule Video" : "Publish Video"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

