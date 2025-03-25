"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TokenData {
  price: string
  priceChange: number
  volume: string
  marketCap: string
  liquidity: string
  pairAddress: string
  holders?: string
  tokenSymbol: string
  tokenName: string
}

interface TokenStatsProps {
  isCompact?: boolean
}

export default function TokenStats({ isCompact }: TokenStatsProps) {
  const [tokenData, setTokenData] = useState<TokenData>({
    price: "$0.0015",
    priceChange: -40.49,
    volume: "$2.85M",
    marketCap: "$1.47M",
    liquidity: "$162.51K",
    pairAddress: "",
    holders: "0",
    tokenSymbol: "CTD",
    tokenName: "ChainTalkDaily",
  })
  const [loading, setLoading] = useState(true)
  const [prevTokenData, setPrevTokenData] = useState<TokenData | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [animating, setAnimating] = useState(false)

  const tokenAddress = "0x7f890a4a575558307826c82e4cb6e671f3178bfc"
  const pairAddress = "0x5bbF5Ce11531c16929fac62e0391caae1cce4674" // BSC pair address

  // Format large numbers
  const formatNumber = (num: string | number) => {
    const value = typeof num === "string" ? Number.parseFloat(num.replace(/[^0-9.]/g, "")) : num

    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(2) + "B"
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + "M"
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + "K"
    } else {
      return value.toFixed(2)
    }
  }

  // Fetch token data from DexScreener API
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Store previous data for transition
        if (!loading && tokenData.price !== "$0.0000") {
          setPrevTokenData(tokenData)
          setAnimating(true)
          setTimeout(() => setAnimating(false), 500)
        }

        setLoading(true)

        // Fetch data from DexScreener API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${pairAddress}`)
        const data = await response.json()

        if (data && data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]

          const newTokenData = {
            price: `$${Number.parseFloat(pair.priceUsd).toFixed(4)}`,
            priceChange: Number.parseFloat(pair.priceChange.h24),
            volume: `$${formatNumber(pair.volume.h24)}`,
            marketCap: `$${formatNumber(pair.fdv)}`,
            liquidity: `$${formatNumber(pair.liquidity.usd)}`,
            pairAddress: pairAddress,
            holders: "12,456", // This is not available from DexScreener API
            tokenSymbol: "CTD",
            tokenName: "ChainTalkDaily",
          }

          setTokenData(newTokenData)
        } else {
          // Fallback data
          setTokenData({
            price: "$0.0015",
            priceChange: -40.49,
            volume: "$2.85M",
            marketCap: "$1.47M",
            liquidity: "$162.51K",
            pairAddress: pairAddress,
            holders: "12,456",
            tokenSymbol: "CTD",
            tokenName: "ChainTalkDaily",
          })
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching token data:", error)

        // Fallback to sample data on error
        if (!loading && tokenData.price !== "$0.0000") {
          setPrevTokenData(tokenData)
          setAnimating(true)
          setTimeout(() => setAnimating(false), 500)
        }

        // Fallback to sample data on error
        setTokenData({
          price: "$0.0015",
          priceChange: -40.49,
          volume: "$2.85M",
          marketCap: "$1.47M",
          liquidity: "$162.51K",
          pairAddress: "0x5bbF5Ce11531c16929fac62e0391caae1cce4674",
          holders: "12,456",
          tokenSymbol: "CTD",
          tokenName: "ChainTalkDaily",
        })

        setLoading(false)
      }
    }

    // Initial fetch
    fetchTokenData()

    // Set up interval for periodic updates
    intervalRef.current = setInterval(fetchTokenData, 30000) // Update every 30 seconds

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (isCompact) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
        {/* Left side - Token info */}
        <div className="space-y-6 pt-8 md:pt-12">
          <div>
            <div className="inline-block px-3 py-1 bg-[#F0B90B]/10 text-[#F0B90B] text-sm font-medium rounded-full mb-4">
              Powered by $CTD
            </div>
            <h2 className="text-2xl font-bold text-black">The ChainTalkDaily Token</h2>
            <p className="text-gray-600 mt-2">
              Access community features and participate in governance with the ChainTalkDaily token on BSC chain.
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mr-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                  alt="CTD Token"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">Public Content</h3>
                <p className="text-xs text-gray-500 mt-1">All videos freely available</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mr-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                  alt="CTD Token"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">Governance</h3>
                <p className="text-xs text-gray-500 mt-1">Vote on platform decisions</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mr-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                  alt="CTD Token"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">BSC Chain</h3>
                <p className="text-xs text-gray-500 mt-1">Built on Binance Smart Chain</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mr-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                  alt="CTD Token"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm">Token Utility</h3>
                <p className="text-xs text-gray-500 mt-1">Growing ecosystem</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 mb-2">
            <Link href="/token">
              <button className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black px-5 py-2.5 rounded-md font-medium transition-all duration-300 transform hover:scale-105">
                Learn More About $CTD
              </button>
            </Link>
          </div>
        </div>

        {/* Right side - Token stats */}
        <div className="bg-white p-6 pt-16 rounded-lg border border-gray-200 shadow-sm w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black">$CTD Token Stats</h3>
            <div className="text-xs bg-[#F0B90B]/20 text-[#F0B90B] px-2 py-1 rounded">Live</div>
          </div>

          {loading && !prevTokenData ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="mt-1">
                    <div className="text-2xl font-bold text-black">
                      <span
                        className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                      >
                        {tokenData.price}
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-sm mt-1 ${tokenData.priceChange >= 0 ? "text-green-500" : "text-red-500"} transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                    >
                      {tokenData.priceChange >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      <span className="whitespace-nowrap">
                        {tokenData.priceChange >= 0 ? "+" : ""}
                        {tokenData.priceChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-500">24h Volume</div>
                  <div className="text-2xl font-bold text-black mt-1">
                    <span
                      className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                    >
                      {tokenData.volume}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-500">Market Cap</div>
                  <div className="text-2xl font-bold text-black mt-1">
                    <span
                      className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                    >
                      {tokenData.marketCap}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-sm text-gray-500">Liquidity</div>
                  <div className="text-2xl font-bold text-black mt-1">
                    <span
                      className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                    >
                      {tokenData.liquidity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`https://four.meme/token/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105"
                >
                  Trade $CTD Token <ExternalLink className="h-4 w-4 inline ml-1" />
                </a>
                <div className="mt-3 bg-[#F0B90B]/10 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-2">Exchanges</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-white rounded-full p-2">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mexc-ffyGmzoEWoYVJ2V6osJwxWKN7LQkZa.png"
                        alt="MEXC"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <div className="bg-white rounded-full p-2">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gate-zqJNiUgwSy4BbPAaH3KRNvuFm2j4db.png"
                        alt="Gate.io"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500">+ 2 more exchanges</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-black">$CTD Token Stats</h3>
        <div className="text-xs bg-[#F0B90B]/20 text-[#F0B90B] px-2 py-1 rounded">Live</div>
      </div>

      {loading && !prevTokenData ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F0B90B]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-sm text-gray-500">Price</div>
              <div className="mt-1">
                <div className="text-2xl font-bold text-black">
                  <span
                    className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                  >
                    {tokenData.price}
                  </span>
                </div>
                <div
                  className={`flex items-center text-sm mt-1 ${tokenData.priceChange >= 0 ? "text-green-500" : "text-red-500"} transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}
                >
                  {tokenData.priceChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="whitespace-nowrap">
                    {tokenData.priceChange >= 0 ? "+" : ""}
                    {tokenData.priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-sm text-gray-500">24h Volume</div>
              <div className="text-2xl font-bold text-black mt-1">
                <span className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}>
                  {tokenData.volume}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-sm text-gray-500">Market Cap</div>
              <div className="text-2xl font-bold text-black mt-1">
                <span className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}>
                  {tokenData.marketCap}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-sm text-gray-500">Liquidity</div>
              <div className="text-2xl font-bold text-black mt-1">
                <span className={`transition-all duration-500 ease-in-out ${animating ? "opacity-0" : "opacity-100"}`}>
                  {tokenData.liquidity}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={`https://four.meme/token/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium py-3 rounded-lg text-center transition-all duration-300 transform hover:scale-105"
            >
              Trade $CTD Token <ExternalLink className="h-4 w-4 inline ml-1" />
            </a>
            <div className="mt-3 bg-[#F0B90B]/10 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">Exchanges</div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-white rounded-full p-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mexc-ffyGmzoEWoYVJ2V6osJwxWKN7LQkZa.png"
                    alt="MEXC"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </div>
                <div className="bg-white rounded-full p-2">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gate-zqJNiUgwSy4BbPAaH3KRNvuFm2j4db.png"
                    alt="Gate.io"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-500">+ 2 more exchanges</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

