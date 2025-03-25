// Simple mock implementation of video service
import { create } from "zustand"

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  views: number
  comments: number
  likes: number
  date: string
  duration: string
  status: "published" | "scheduled" | "draft"
  host: string
  category: string
  tags: string[]
  featured: boolean
  isFeaturedOnHome: boolean
}

// Initial mock data
const initialVideos: Video[] = [
  {
    id: "1",
    title: "Crypto Education: Understanding Key Concepts",
    description: "Learn about the fundamental concepts of cryptocurrency and blockchain technology.",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    videoUrl: "/videos/video1.mp4",
    views: 24500,
    comments: 342,
    likes: 1820,
    date: "2025-03-22",
    duration: "22:15",
    status: "published",
    host: "CZ",
    category: "educational",
    tags: ["Blockchain", "Crypto", "Education"],
    featured: true,
    isFeaturedOnHome: true,
  },
  {
    id: "2",
    title: "Blockchain Technology Basics",
    description: "Explanation of the fundamental concepts of blockchain technology for beginners.",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    videoUrl: "/videos/video2.mp4",
    views: 18200,
    comments: 256,
    likes: 1540,
    date: "2025-03-19",
    duration: "18:42",
    status: "published",
    host: "Yi He",
    category: "educational",
    tags: ["Blockchain", "Technology", "Beginners"],
    featured: false,
    isFeaturedOnHome: false,
  },
]

// Create a store with Zustand
interface VideoStore {
  videos: Video[]
  getVideo: (id: string) => Video | undefined
  getVideos: (filter?: any) => Video[]
  updateVideo: (id: string, data: Partial<Video>) => boolean
  deleteVideo: (id: string) => boolean
  setFeatured: (id: string, featured: boolean) => boolean
  setFeaturedOnHome: (id: string, featured: boolean) => boolean
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: initialVideos,

  getVideo: (id) => {
    return get().videos.find((v) => v.id === id)
  },

  getVideos: (filter) => {
    if (!filter) return get().videos

    let filteredVideos = [...get().videos]

    if (filter.status) {
      filteredVideos = filteredVideos.filter((v) => v.status === filter.status)
    }

    return filteredVideos
  },

  updateVideo: (id, data) => {
    const videos = get().videos
    const index = videos.findIndex((v) => v.id === id)

    if (index === -1) return false

    const updatedVideos = [...videos]
    updatedVideos[index] = { ...updatedVideos[index], ...data }

    set({ videos: updatedVideos })
    return true
  },

  deleteVideo: (id) => {
    const videos = get().videos
    const filteredVideos = videos.filter((v) => v.id !== id)

    if (filteredVideos.length === videos.length) return false

    set({ videos: filteredVideos })
    return true
  },

  setFeatured: (id, featured) => {
    const videos = get().videos
    const index = videos.findIndex((v) => v.id === id)

    if (index === -1) return false

    const updatedVideos = [...videos]
    updatedVideos[index] = { ...updatedVideos[index], featured }

    set({ videos: updatedVideos })
    return true
  },

  setFeaturedOnHome: (id, featured) => {
    const videos = get().videos
    const index = videos.findIndex((v) => v.id === id)

    if (index === -1) return false

    const updatedVideos = [...videos]
    updatedVideos[index] = { ...updatedVideos[index], isFeaturedOnHome: featured }

    set({ videos: updatedVideos })
    return true
  },
}))

// Helper functions for formatting
export const formatViews = (views: number) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M"
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K"
  }
  return views.toString()
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  } else {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }
}

// Categories for filtering
export const videoCategories = [
  { value: "all", label: "All Categories" },
  { value: "educational", label: "Educational" },
  { value: "market-analysis", label: "Market Analysis" },
  { value: "regulatory", label: "Regulatory" },
  { value: "technology", label: "Technology" },
  { value: "interview", label: "Interviews" },
]

// Sort options
export const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
]

