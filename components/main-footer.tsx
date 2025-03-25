"use client"
import Link from "next/link"
import Image from "next/image"
import { NewsletterForm } from "@/components/newsletter-form"

export default function MainFooter({ showCommunitySection = false }: { showCommunitySection?: boolean }) {
  return (
    <footer className="bg-white border-t border-gray-200">
      {showCommunitySection && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-xl text-gray-600 mb-8">
                Connect with fellow crypto enthusiasts and stay updated with the latest insights
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      )}

      {/* Footer Links */}
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24">
            <div>
              <h3 className="text-lg font-bold mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#F0B90B]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="text-gray-600 hover:text-[#F0B90B]">
                    Videos
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#F0B90B]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/token" className="text-gray-600 hover:text-[#F0B90B]">
                    $CTD Token
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-[#F0B90B]">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://t.me/CTDPublic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#F0B90B]"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/ChainTalkDaily"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#F0B90B]"
                  >
                    X (Twitter)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:max-w-xs">
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-gray-600 mb-4">Stay updated with the latest crypto news and analysis</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center gap-2 mr-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                alt="ChainTalkDaily Logo"
                width={24}
                height={24}
                className="rounded-full object-cover object-center"
                style={{ objectPosition: "50% 50%" }}
              />
              <span className="font-bold">ChainTalkDaily</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 ChainTalkDaily. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://x.com/ChainTalkDaily" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg className="w-5 h-5 text-gray-500 hover:text-[#F0B90B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <a href="https://t.me/CTDPublic" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg className="w-5 h-5 text-gray-500 hover:text-[#F0B90B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

