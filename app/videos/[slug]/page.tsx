"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Share2 } from "lucide-react"
import VideoPlayer from "@/components/video-player"
import { Button } from "@/components/ui/button"
import { useVideoStore } from "@/lib/video-service"

interface VideoPageProps {
  params: {
    slug: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Get the current video and related videos from the store
  const video = useVideoStore((state) => state.getVideo(params.slug))
  const allVideos = useVideoStore((state) => state.getVideos({ status: "published" }))

  // Related videos (excluding current video)
  const relatedVideos = allVideos.filter((v) => v.id !== params.slug).slice(0, 2)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container py-6 md:py-8 px-4 md:px-6">
          <Link href="/videos" className="flex items-center text-[#F0B90B] hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos
          </Link>

          <div className="max-w-5xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold text-black mb-4">Video Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, the video you're looking for doesn't exist or has been moved.</p>
            <Link href="/videos">
              <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">Browse All Videos</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-6 md:py-8 px-4 md:px-6">
        <Link href="/videos" className="flex items-center text-[#F0B90B] hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Videos
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="bg-black rounded-xl overflow-hidden shadow-xl">
            <VideoPlayer src={video.videoUrl} poster={video.thumbnail} title={video.title} />
          </div>

          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-black">{video.title}</h1>

            <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-black mb-6">More Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {relatedVideos.map((relatedVideo) => (
                <Link href={`/videos/${relatedVideo.id}`} key={relatedVideo.id} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#F0B90B]/30">
                    <div className="relative aspect-video">
                      <Image
                        src={relatedVideo.thumbnail || "/placeholder.svg"}
                        alt={relatedVideo.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 group-hover:text-[#F0B90B] transition-colors">
                        {relatedVideo.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

