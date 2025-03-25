"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fix for mobile menu background issue when scrolled
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden"
      // Scroll to top when menu is opened
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
              alt="ChainTalkDaily Logo"
              width={40}
              height={40}
              className="rounded-full object-cover object-center"
              style={{ objectPosition: "50% 50%" }}
            />
            <span className="text-xl font-bold text-black">ChainTalkDaily</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#F0B90B] transition-colors">
            Home
          </Link>
          <Link href="/videos" className="text-sm font-medium text-gray-600 hover:text-[#F0B90B] transition-colors">
            Videos
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-[#F0B90B] transition-colors">
            About
          </Link>
          <Link href="/token" className="text-sm font-medium text-gray-600 hover:text-[#F0B90B] transition-colors">
            $CTD Token
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-[#F0B90B] transition-colors">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/token" className="hidden md:block">
            <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black transition-all duration-300 transform hover:scale-105">
              Get $CTD
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="md:hidden text-black">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="fixed right-0 top-0 h-full w-[80%] max-w-[350px] bg-white shadow-lg flex flex-col z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                  alt="ChainTalkDaily Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-bold">ChainTalkDaily</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto py-6 px-4 bg-white">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-base py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/videos"
                  className="text-base py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Videos
                </Link>
                <Link
                  href="/about"
                  className="text-base py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/token"
                  className="text-base py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  $CTD Token
                </Link>
                <Link
                  href="/blog"
                  className="text-base py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </nav>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <Link
                href="/token"
                className="inline-flex items-center justify-center w-full gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get $CTD
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

