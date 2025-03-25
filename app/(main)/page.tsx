"use client"

import { useEffect, useState, useMemo } from "react"
import { ArrowRight, Info, Calendar } from "lucide-react"
import Link from "next/link"
import VideoPlayer from "@/components/video-player"
import TokenStats from "@/components/token-stats"
import { useVideoStore } from "@/lib/video-service"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // Get videos from the store
  const allVideos = useVideoStore((state) => state.videos)

  // Derive featured, latest, and popular videos
  const featuredVideos = useMemo(() => {
    return allVideos.filter((v) => v.status === "published" && v.isFeaturedOnHome)
  }, [allVideos])

  const latestVideos = useMemo(() => {
    return [...allVideos]
      .filter((v) => v.status === "published")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }, [allVideos])

  const popularVideos = useMemo(() => {
    return [...allVideos]
      .filter((v) => v.status === "published")
      .sort((a, b) => b.views - a.views)
      .slice(0, 3)
  }, [allVideos])

  // Featured video for hero section
  const heroVideo = useMemo(() => {
    return featuredVideos.length > 0 ? featuredVideos[0] : latestVideos.length > 0 ? latestVideos[0] : null
  }, [featuredVideos, latestVideos])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white text-black">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-[10%] w-24 h-24 rounded-full bg-[#F0B90B]/10 blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-[10%] w-32 h-32 rounded-full bg-[#F0B90B]/10 blur-xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 right-[20%] w-16 h-16 rounded-full bg-[#F0B90B]/10 blur-xl animate-pulse delay-1000"></div>

          <div className="container relative z-10 py-16 md:py-24 lg:py-32">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-[#F0B90B]/10 px-4 py-2 rounded-full text-[#F0B90B] font-medium text-sm">
                  Comprehensive Crypto Learning Platform
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
                  Learn Crypto with <span className="text-[#F0B90B]">Expert</span> Insights
                </h1>
                <p className="text-lg md:text-xl text-gray-700">
                  Access educational content based on insights from industry experts like CZ and Yi He to enhance your
                  understanding of the crypto ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/videos" className="inline-block">
                    <Button className="w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium px-6 py-4 rounded-md transform transition-transform hover:scale-105">
                      Start Exploring Now
                    </Button>
                  </Link>
                  <Link href="/token" className="inline-block">
                    <Button
                      variant="outline"
                      className="w-full border border-gray-300 hover:bg-gray-100 text-black font-medium px-6 py-4 rounded-md transform transition-transform hover:scale-105"
                    >
                      Discover $CTD Token
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Educational content for informational purposes.</span>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -top-10 -left-10 w-full h-full bg-[#F0B90B]/10 rounded-2xl transform rotate-3 animate-pulse"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg transform transition-transform hover:scale-[1.02]">
                  {heroVideo ? (
                    <VideoPlayer src={heroVideo.videoUrl} poster={heroVideo.thumbnail} title={heroVideo.title} />
                  ) : (
                    <VideoPlayer
                      src="/videos/big.mp4"
                      poster="/placeholder.svg?height=720&width=1280"
                      title="Latest Episode"
                    />
                  )}
                  <h3 className="text-xl font-medium text-black mt-4 mb-2">Latest Episode</h3>
                  <p className="text-gray-700 mb-4">
                    {heroVideo ? heroVideo.title : "CZ's Crypto Education: Understanding Key Concepts"}
                  </p>
                  {heroVideo && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{heroVideo.host}</span>
                      <span className="mx-2">•</span>
                      <span>{heroVideo.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Token Stats Section */}
        <section className="py-8 pb-12 md:py-12 md:pb-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <div>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                  <div>
                    <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
                      CRYPTO MARKET
                    </div>
                    <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                        alt="CTD Token"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-black">$CTD Token Performance</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      Track the latest price movements and market data for the ChainTalkDaily token
                    </p>
                  </div>
                  <Link href="/token" className="flex items-center text-[#F0B90B] hover:underline mt-4 md:mt-0 group">
                    View Token Details{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
                  <TokenStats key="token-stats" isCompact={true} />
                  {/* Exchanges section moved to TokenStats component */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple divider */}
        <div className="border-t border-gray-100"></div>

        {/* About Project Section */}
        <section className="py-20 md:py-28 bg-white overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 right-0 w-72 h-72 bg-[#F0B90B]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#F0B90B]/5 rounded-full blur-3xl"></div>

          <div className="container relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block bg-[#F0B90B]/10 px-4 py-2 rounded-full text-[#F0B90B] font-medium text-sm mb-4 transform transition-all duration-500 hover:scale-105 hover:shadow-md">
                  ABOUT CHAINTALKDAILY
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
                  Learn Crypto the <span className="text-[#F0B90B]">Fun Way</span>
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    ChainTalkDaily is an educational platform that makes learning about cryptocurrency and blockchain
                    technology enjoyable and accessible. We believe that education should be fun, engaging, and easy to
                    understand.
                  </p>
                  <p className="leading-relaxed">
                    Through our video content, we break down complex topics into digestible, entertaining lessons that
                    anyone can follow.
                  </p>
                  <div className="bg-[#F0B90B]/5 border border-[#F0B90B]/20 rounded-lg p-4 my-6">
                    <p className="text-gray-700 font-medium">
                      <strong className="text-[#F0B90B]">Note:</strong> We are not directly affiliated with CZ or Yi He.
                      We use public statements and insights as learning tools to help you navigate the crypto world in
                      an engaging way.
                    </p>
                  </div>
                </div>
                <Link href="/about" className="group mt-8 inline-flex">
                  <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
                    Learn More About Us
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="relative order-1 md:order-2">
                <div className="absolute -top-8 -right-8 w-full h-full bg-[#F0B90B]/10 rounded-2xl transform -rotate-3 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-full h-full bg-[#F0B90B]/5 rounded-2xl transform rotate-6 animate-pulse animation-delay-700"></div>

                <div className="relative bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-03-24_04-13-06.jpg-j7e8kngxEQf4Cj59ir2Ft2YVY8jrKc.jpeg"
                    alt="ChainTalkDaily sign"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple divider */}
        <div className="border-t border-gray-100"></div>

        {/* Blog Coming Soon Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
                  EXPERT PERSPECTIVES
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-black">Blog Coming Soon</h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  In-depth explorations of perspectives on the crypto industry
                </p>
              </div>
            </div>

            <div className="relative bg-white rounded-xl border border-[#F0B90B]/20 shadow-lg overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F0B90B]/5 via-white to-[#F0B90B]/10"></div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0B90B]/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F0B90B]/5 rounded-full blur-3xl"></div>

              <div className="relative flex flex-col md:flex-row items-center p-8 md:p-12">
                <div className="bg-[#F0B90B]/20 p-6 rounded-full mb-6 md:mb-0 md:mr-8 shadow-lg">
                  <Calendar className="h-12 w-12 text-[#F0B90B]" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-black mb-3">Our Blog is Coming Soon</h3>
                  <p className="text-gray-600 max-w-lg mb-6">
                    We're preparing insightful articles and analysis from industry experts. Check back soon for the
                    latest content on blockchain technology, cryptocurrency markets, and educational resources.
                  </p>
                  <Link href="/videos">
                    <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
                      Explore Videos Instead
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

