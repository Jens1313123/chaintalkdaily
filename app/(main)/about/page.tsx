import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-[10%] w-24 h-24 rounded-full bg-[#F0B90B]/10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-[10%] w-32 h-32 rounded-full bg-[#F0B90B]/10 blur-xl animate-pulse delay-700"></div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-[#F0B90B]/10 px-4 py-2 rounded-full text-[#F0B90B] font-medium text-sm mb-6">
              ABOUT US
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Making Crypto Education Accessible</h1>
            <p className="text-xl text-gray-700 mb-8">
              ChainTalkDaily is dedicated to making cryptocurrency and blockchain education accessible, engaging, and
              enjoyable for everyone, from beginners to advanced users.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
                OUR MISSION
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Empowering Through Education</h2>
              <p className="text-gray-600 mb-4">
                At ChainTalkDaily, our mission is to empower individuals through high-quality educational content about
                cryptocurrency and blockchain technology. We believe that education is the foundation of informed
                decision-making in the crypto space.
              </p>
              <p className="text-gray-600 mb-4">
                We strive to break down complex concepts into digestible, engaging content that anyone can understand,
                regardless of their technical background or experience level.
              </p>
              <p className="text-gray-600">
                ChainTalkDaily is not directly affiliated with CZ, Yi He, or Binance. We use their public statements and
                insights as learning tools to help you navigate the crypto world in an engaging way.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-full h-full bg-[#F0B90B]/10 rounded-2xl transform -rotate-3 animate-pulse"></div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo_2025-03-24_04-13-06.jpg-j7e8kngxEQf4Cj59ir2Ft2YVY8jrKc.jpeg"
                  alt="Our Mission"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Content */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
              OUR CONTENT
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">Educational Resources</h2>
            <p className="text-gray-600">
              We offer a variety of content formats to cater to different learning preferences and needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#F0B90B]/30">
              <div className="w-16 h-16 bg-[#F0B9কিন্ত90B]/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B]"
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Video Content</h3>
              <p className="text-gray-600 mb-4">
                Engaging video lessons featuring insights from industry experts like CZ and Yi He, breaking down complex
                topics into digestible segments.
              </p>
              <Link href="/videos" className="text-[#F0B90B] hover:underline flex items-center">
                Explore Videos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#F0B90B]/30">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B]"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Blog Articles</h3>
              <p className="text-gray-600 mb-4">
                In-depth articles exploring various aspects of cryptocurrency, blockchain technology, market analysis,
                and educational resources.
              </p>
              <Link href="/blog" className="text-[#F0B90B] hover:underline flex items-center">
                Read Articles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#F0B90B]/30">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-[#F0B90B]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Community</h3>
              <p className="text-gray-600 mb-4">
                Join our growing community of crypto enthusiasts to discuss, learn, and share insights about the
                evolving blockchain ecosystem.
              </p>
              <a
                href="https://t.me/CTDPublic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F0B90B] hover:underline flex items-center"
              >
                Join Community <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
              OUR VALUES
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">What We Stand For</h2>
            <p className="text-gray-600">Our core values guide everything we do at ChainTalkDaily.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg transition-all duration-300 hover:bg-[#F0B90B]/5 hover:scale-105 hover:shadow-lg cursor-pointer group">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#F0B90B]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B] transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                </svg>
              </div>
              <h3 className="font-bold text-black mb-1 group-hover:text-[#F0B90B] transition-colors duration-300">
                Security
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                We prioritize teaching security best practices to help protect your investments
              </p>
            </div>

            <div className="p-6 rounded-lg transition-all duration-300 hover:bg-[#F0B90B]/5 hover:scale-105 hover:shadow-lg cursor-pointer group">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#F0B90B]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B] transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-black mb-1 group-hover:text-[#F0B90B] transition-colors duration-300">
                Research
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                We provide in-depth market analysis based on thorough research
              </p>
            </div>

            <div className="p-6 rounded-lg transition-all duration-300 hover:bg-[#F0B90B]/5 hover:scale-105 hover:shadow-lg cursor-pointer group">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#F0B90B]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B] transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
                </svg>
              </div>
              <h3 className="font-bold text-black mb-1 group-hover:text-[#F0B90B] transition-colors duration-300">
                Fun Learning
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                We believe education should be enjoyable and engaging
              </p>
            </div>

            <div className="p-6 rounded-lg transition-all duration-300 hover:bg-[#F0B90B]/5 hover:scale-105 hover:shadow-lg cursor-pointer group">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#F0B90B]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#F0B90B] transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-black mb-1 group-hover:text-[#F0B90B] transition-colors duration-300">
                Education
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                We provide content for all levels, from basic to advanced
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-[#F0B90B]/10 px-3 py-1 rounded-full text-[#F0B90B] font-medium text-sm mb-3">
              JOIN US
            </div>
            <h2 className="text-3xl font-bold text-black mb-4">Community</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our growing community of crypto enthusiasts to discuss, learn, and share insights about the evolving
              blockchain ecosystem.
            </p>
            <a href="https://t.me/CTDPublic" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105">
                Join Community
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-4">Important Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                ChainTalkDaily is not directly affiliated with CZ, Yi He, or Binance. We use their public statements and
                insights as learning tools to help you navigate the crypto world in an engaging way.
              </p>
              <p className="text-gray-600">
                All content on this platform is for educational and informational purposes only. It should not be
                considered financial advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-gray-600 mb-8">Explore our educational content and join our community today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/videos">
                <Button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 w-full sm:w-auto">
                  Explore Videos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/token">
                <Button variant="outline" className="px-6 py-3 rounded-lg w-full sm:w-auto">
                  Learn About $CTD Token
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

