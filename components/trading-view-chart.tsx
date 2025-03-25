"use client"

import { useEffect, useRef, useState } from "react"
import { createChart } from "lightweight-charts"

interface TradingViewChartProps {
  timeframe?: string
}

export default function TradingViewChart({ timeframe = "1h" }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)

  // Generate sample price data
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

      // Generate random price movement
      const changePercent = (Math.random() - 0.5) * 0.02 // -1% to +1%
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

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    // Create chart
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

    // Create line series instead of candlestick
    const lineSeries = chart.addLineSeries({
      color: "#F0B90B",
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: "#F0B90B",
      crosshairMarkerBackgroundColor: "#F0B90B",
      lastValueVisible: true,
      priceLineVisible: true,
      priceLineWidth: 1,
      priceLineColor: "#F0B90B",
      priceLineStyle: 1,
    })

    // Save references
    chartRef.current = chart
    seriesRef.current = lineSeries

    // Generate and set data
    const data = generatePriceData()

    // Set data
    lineSeries.setData(data)

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
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
      if (chart) {
        chart.remove()
      }
    }
  }, [timeframe])

  // Simulate real-time updates
  useEffect(() => {
    if (!seriesRef.current) return

    const interval = setInterval(() => {
      const lastData = seriesRef.current.dataByIndex(seriesRef.current.dataByIndex().length - 1)
      if (!lastData) return

      // Update with small random change
      const changePercent = (Math.random() - 0.5) * 0.002 // 0.2% max change
      const newValue = lastData.value * (1 + changePercent)

      const updatedPoint = {
        time: lastData.time + 60, // Add 60 seconds
        value: newValue,
      }

      seriesRef.current.update(updatedPoint)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

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

