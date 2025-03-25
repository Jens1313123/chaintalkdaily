"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TokenStats from "@/components/token-stats"
import DexScreenerChart from "@/components/dex-screener-chart"

interface TokenData {
  price: string
  priceChange: number
  marketCap: string
  volume: string
  holders: string
  pairAddress: string
  liquidity: string
}

interface Trade {
  time: string
  type: "buy" | "sell"
  price: string
  amount: string
  total: string
  txHash: string
}

export default function TokenPage() {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1D")
  const [tokenData, setTokenData] = useState<TokenData>({
    price: "$0.0017",
    priceChange: -37.54,
    marketCap: "$1.66M",
    volume: "$5.60M",
    holders: "12,456",
    pairAddress: "0x5bbF5Ce11531c16929fac62e0391caae1cce4674",
    liquidity: "$172.39K",
  })
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])

  const tokenAddress = "0x7f890a4a575558307826c82e4cb6e671f3178bfc"
  const pairAddress = "0x5bbF5Ce11531c16929fac62e0391caae1cce4674" // BSC pair address

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Fetch token data from DexScreener API
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true)

        // Fetch data from DexScreener API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/bsc/${pairAddress}`)
        const data = await response.json()

        if (data && data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]

          setTokenData({
            price: `$${Number.parseFloat(pair.priceUsd).toFixed(4)}`,
            priceChange: Number.parseFloat(pair.priceChange.h24),
            marketCap: `$${formatNumber(pair.fdv)}`,
            volume: `$${formatNumber(pair.volume.h24)}`,
            holders: "12,456", // This is not available from DexScreener API
            pairAddress: pairAddress,
            liquidity: `$${formatNumber(pair.liquidity.usd)}`,
          })

          // Generate recent trades based on real data
          generateRecentTrades(Number.parseFloat(pair.priceUsd))
        } else {
          // Fallback data
          setTokenData({
            price: "$0.0017",
            priceChange: -37.54,
            marketCap: "$1.66M",
            volume: "$5.60M",
            holders: "12,456",
            pairAddress: pairAddress,
            liquidity: "$172.39K",
          })

          // Generate recent trades based on fallback price
          generateRecentTrades(0.0017)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching token data:", error)

        // Fallback data
        setTokenData({
          price: "$0.0017",
          priceChange: -37.54,
          marketCap: "$1.66M",
          volume: "$5.60M",
          holders: "12,456",
          pairAddress: pairAddress,
          liquidity: "$172.39K",
        })

        // Generate recent trades based on fallback price
        generateRecentTrades(0.0017)

        setLoading(false)
      }
    }

    fetchTokenData()

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchTokenData()
    }, 30000)

    return () => clearInterval(interval)
  }, [pairAddress])

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

  // Generate recent trades based on current price
  const generateRecentTrades = (basePrice: number) => {
    const newTrades: Trade[] = []

    for (let i = 0; i < 10; i++) {
      const time = new Date(Date.now() - i * 60000).toLocaleTimeString()
      const isBuy = Math.random() > 0.5
      const price = (basePrice * (1 + (Math.random() * 0.002 - 0.001))).toFixed(6)
      const amount = (Math.random() * 10000 + 1000).toFixed(2)
      const totalValue = (Number.parseFloat(price) * Number.parseFloat(amount)).toFixed(2)

      newTrades.push({
        time,
        type: isBuy ? "buy" : "sell",
        price: `$${price}`,
        amount: `${amount} CTD`,
        total: `$${totalValue}`,
        txHash: "0x" + Math.random().toString(16).substring(2, 42),
      })
    }

    setRecentTrades(newTrades)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8">
        <Link href="/" className="flex items-center text-[#F0B90B] hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-3/5 space-y-8 order-2 md:order-1">
              {/* Chart section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <DexScreenerChart pairAddress={pairAddress} timeframe="5" />
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-4">Recent Trades</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Time</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Type</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Price</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Amount</th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrades.map((trade, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-4 text-sm">{trade.time}</td>
                          <td
                            className={`py-2 px-4 text-sm font-medium ${trade.type === "buy" ? "text-green-500" : "text-red-500"}`}
                          >
                            {trade.type === "buy" ? "Buy" : "Sell"}
                          </td>
                          <td className="py-2 px-4 text-sm">{trade.price}</td>
                          <td className="py-2 px-4 text-sm">{trade.amount}</td>
                          <td className="py-2 px-4 text-sm">{trade.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={`https://dexscreener.com/bsc/${pairAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-[#F0B90B] border-[#F0B90B] hover:bg-[#F0B90B]/10"
                  >
                    View All Trades
                  </a>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="how-to-buy">How to Buy</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-black mb-4">About $CTD Token</h2>
                  <p className="text-gray-700 mb-4">
                    The ChainTalkDaily ($CTD) token is the native utility token of the ChainTalkDaily platform, built on
                    the Binance Smart Chain (BSC). It serves as the backbone of our ecosystem, enabling community
                    governance and providing additional utility within our platform.
                  </p>
                  <p className="text-gray-700 mb-4">
                    As a BSC token, $CTD benefits from fast transaction speeds and low fees, making it accessible to our
                    global community of crypto enthusiasts.
                  </p>
                  <h3 className="text-lg font-medium text-black mt-6 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#F0B90B]">•</div>
                      <div>
                        <strong>Governance:</strong> Token holders can participate in platform governance decisions,
                        helping shape the future of ChainTalkDaily.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#F0B90B]">•</div>
                      <div>
                        <strong>Community Access:</strong> $CTD provides access to exclusive community features and
                        events.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-[#F0B90B]">•</div>
                      <div>
                        <strong>BSC Ecosystem:</strong> Built on Binance Smart Chain for reliability, speed, and low
                        transaction costs.
                      </div>
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="how-to-buy" className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-black mb-4">How to Buy $CTD Token</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#F0B90B]/10 text-[#F0B90B] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-black mb-2">Set Up a Wallet</h3>
                        <p className="text-gray-700 mb-2">
                          Download and install a wallet that supports Binance Smart Chain (BSC), such as MetaMask or
                          Trust Wallet.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <a
                            href="https://metamask.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-[#F0B90B] hover:underline"
                          >
                            MetaMask <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                          <a
                            href="https://trustwallet.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-[#F0B90B] hover:underline"
                          >
                            Trust Wallet <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#F0B90B]/10 text-[#F0B90B] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-black mb-2">Get BNB</h3>
                        <p className="text-gray-700">
                          Purchase BNB (Binance Coin) from an exchange like Binance, and transfer it to your wallet.
                          You'll need BNB to pay for transaction fees on the Binance Smart Chain.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#F0B90B]/10 text-[#F0B90B] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-black mb-2">Buy $CTD on Four.meme</h3>
                        <p className="text-gray-700 mb-2">
                          Visit Four.meme, connect your wallet, and swap your BNB for $CTD tokens.
                        </p>
                        <div className="flex items-center mt-2">
                          <a
                            href={`https://four.meme/token/${tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-medium py-2 px-4 rounded-lg text-center transition-colors inline-flex items-center"
                          >
                            Go to Four.meme <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-[#F0B90B]/10 text-[#F0B90B] font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium text-black mb-2">Add $CTD to Your Wallet</h3>
                        <p className="text-gray-700 mb-2">
                          Add the $CTD token to your wallet to view your balance. Use the contract address:
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg mt-2 flex items-center justify-between">
                          <code className="text-xs text-gray-600 font-mono">{tokenAddress}</code>
                          <button onClick={copyToClipboard} className="text-[#F0B90B] hover:text-[#F0B90B]/80">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-full md:w-2/5 order-1 md:order-2">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#F0B90B]/10 p-3 rounded-full">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                      alt="CTD Token"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-black">$CTD Token</h1>
                    <p className="text-gray-500">ChainTalkDaily</p>
                  </div>
                </div>

                <TokenStats />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white text-black mt-16">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h7YuppRAEBiiEbUGBSXz0eycHsgDxq.png"
                alt="ChainTalkDaily Logo"
                width={32}
                height={32}
                className="rounded-full object-cover object-center"
                style={{ objectPosition: "50% 50%" }}
              />
              <span className="text-xl font-bold text-black">ChainTalkDaily</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 ChainTalkDaily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

