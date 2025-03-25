"use client"

import { useEffect, useRef, useState } from "react"
import { createChart } from "lightweight-charts"

interface AreaChartProps {
  data?: { time: number; value: number }[]
  color?: string
  timeframe?: string
}

export default function AreaChart({ data: initialData, color = "#F0B90B", timeframe = "1h" }: AreaChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate sample price data if none provided
  const generatePriceData = (basePrice = 0.0835, count = 100) => {
    const data = []
    const now = new Date()
    let currentPrice = basePrice

    // Determine time interval based on timeframe
    let timeInterval: number
    switch (timeframe) {
      case "5m":
        timeInterval = 5 * 60 * 1000
        break
      case "15m":
        timeInterval = 15 * 60 * 1000
        break
      case "1h":
        timeInterval = 60 * 60 * 1000
        break
      case "4h":
        timeInterval = 4 * 60 * 60 * 1000
        break
      case "1d":
        timeInterval = 24 * 60 * 60 * 1000
        break
      case "1w":
        timeInterval = 7 * 24 * 60 * 60 * 1000
        break
      default:
        timeInterval = 60 * 60 * 1000
    }

    for (let i = 0; i < count; i++) {
      const time = new Date(now.getTime() - (count - i) * timeInterval)

      // Generate random price movement with upward trend
      const changePercent = Math.random() * 0.02 - 0.005 // -0.5% to +1.5% (slight upward bias)
      currentPrice = currentPrice * (1 + changePercent)

      data.push({
        time: time.getTime() / 1000,
        value: currentPrice,
      })
    }

    return data
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    setIsLoading(true)

    const chartData = initialData || generatePriceData()

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f3fa" },
        horzLines: { color: "#f0f3fa" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    // Create area series
    const areaSeries = chart.addAreaSeries({
      topColor: `${color}50`, // 50% opacity
      bottomColor: `${color}10`, // 10% opacity
      lineColor: color,
      lineWidth: 2,
    })

    // Set data
    areaSeries.setData(chartData)

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener("resize", handleResize)

    setIsLoading(false)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      chart.remove()
    }
  }, [initialData, color, timeframe])

  return (
    <div className="w-full h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}

