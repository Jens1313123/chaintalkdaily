"use client"

import { useState } from "react"

interface DexScreenerChartProps {
  pairAddress?: string
  timeframe?: string
}

export default function DexScreenerChart({
  pairAddress = "0x5bbF5Ce11531c16929fac62e0391caae1cce4674",
  timeframe = "5",
}: DexScreenerChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)

  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe)
  }

  // Construct the iframe URL with the exact parameters from the provided code
  const iframeUrl = `https://dexscreener.com/bsc/${pairAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTimeframesToolbar=0&loadChartSettings=0&chartDefaultOnMobile=1&chartTheme=light&theme=light&chartStyle=1&chartType=marketCap&interval=${selectedTimeframe}`

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-black">$CTD Price Chart</h2>
        <div className="flex flex-wrap gap-1">
          {["1", "5", "15", "30", "60", "240", "1D", "1W"].map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                selectedTimeframe === tf
                  ? "bg-[#F0B90B] text-black font-medium"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tf.includes("D") || tf.includes("W") ? tf : `${tf}m`}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-lg overflow-hidden border border-gray-200">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          #dexscreener-embed {
            position: relative;
            width: 100%;
            padding-bottom: 125%;
          }
          
          @media(min-width: 1400px) {
            #dexscreener-embed {
              padding-bottom: 65%;
            }
          }
          
          #dexscreener-embed iframe {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border: 0;
          }
        `,
          }}
        />

        <div id="dexscreener-embed">
          <iframe src={iframeUrl} title="DEX Screener Chart" />
        </div>
      </div>

      <div className="text-xs text-gray-500 flex items-center justify-end">
        Powered by{" "}
        <a
          href={`https://dexscreener.com/bsc/${pairAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-[#F0B90B] hover:underline"
        >
          DexScreener
        </a>
      </div>
    </div>
  )
}

