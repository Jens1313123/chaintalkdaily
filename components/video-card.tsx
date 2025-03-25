import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"

interface VideoCardProps {
  id: string
  title: string
  thumbnail: string
  views: string
  duration: string
  date: string
  featured?: boolean
  host?: string
  compact?: boolean
  description?: string
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  views,
  duration,
  date,
  featured = false,
  host,
  compact = false,
  description,
}: VideoCardProps) {
  if (compact) {
    return (
      <div className="group relative flex gap-3 items-start">
        <Link href={`/videos/${id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View video</span>
        </Link>
        <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            width={480}
            height={360}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
            {duration}
          </div>
          {host && (
            <div className="absolute top-1 left-1 bg-[#F0B90B] text-black text-[10px] px-1 py-0.5 rounded-full">
              {host}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-[#F0B90B] transition-colors">{title}</h3>
          {(views || date) && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              {views && <span>{views} views</span>}
              {views && date && <span className="mx-1">•</span>}
              {date && <span>{date}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`group relative overflow-hidden rounded-lg ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/videos/${id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View video</span>
      </Link>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={1280}
          height={720}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">{duration}</div>
        {host && (
          <div className="absolute top-3 left-3 bg-[#F0B90B] text-black text-xs px-2 py-1 rounded-full">{host}</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#F0B90B] rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110">
            <Play className="h-8 w-8 text-black" fill="black" />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-medium line-clamp-2 group-hover:text-[#F0B90B] transition-colors">{title}</h3>
        {description && <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>}
        {(views || date) && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            {views && <span>{views} views</span>}
            {views && date && <span className="mx-1">•</span>}
            {date && <span>{date}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

