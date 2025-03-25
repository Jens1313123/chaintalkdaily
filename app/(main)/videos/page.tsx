import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
// Update the component to use the video store directly
import { useVideoStore } from "@/lib/video-service"

export default function VideosPage() {
  // Get videos from the store to ensure we always have the latest data
  const videos = useVideoStore((state) =>
    state.getVideos({ status: "published" }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  )

  // Featured video (first in the list)
  const featuredVideo = videos.find((v) => v.featured) || (videos.length > 0 ? videos[0] : null)

  // Other videos (excluding the featured one)
  const otherVideos = featuredVideo ? videos.filter((v) => v.id !== featuredVideo.id).slice(0, 2) : videos.slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#F0B90B]/10 px-4 py-2 rounded-full text-[#F0B90B] font-medium text-sm mb-4">
              EDUCATIONAL VIDEOS
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Learn from Industry Experts</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our collection of educational videos featuring insights on cryptocurrency and blockchain
              technology.
            </p>
          </div>

          {/* Featured Video */}
          {featuredVideo && (
            <div className="mb-16">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
                <div className="relative aspect-video">
                  <Image
                    src={featuredVideo.thumbnail || "/placeholder.svg"}
                    alt={featuredVideo.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Link href={`/videos/${featuredVideo.id}`} className="z-10">
                      <div className="bg-[#F0B90B] rounded-full p-4 transform transition-transform duration-300 hover:scale-110 cursor-pointer">
                        <Play className="h-8 w-8 text-black" fill="black" />
                      </div>
                    </Link>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded">
                    {featuredVideo.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-black mb-2">{featuredVideo.title}</h2>
                  <p className="text-gray-600 mb-4">{featuredVideo.description}</p>
                  <Link href={`/videos/${featuredVideo.id}`}>
                    <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black">
                      Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Other Videos */}
          <h2 className="text-2xl font-bold text-black mb-6">More Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {otherVideos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#F0B90B]/30">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2 group-hover:text-[#F0B9কিন্তB] transition-colors">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

