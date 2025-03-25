"use client"

import { useEffect, useRef, useState } from "react"

interface SimpleChartProps {
  timeframe?: string
  color?: string
}

export default function SimplePriceChart({ timeframe = "1h", color = "#F0B90B" }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate sample price data
  const generatePriceData = (basePrice = 0.0835, count = 100) => {
    const data = []
    let currentPrice = basePrice

    // Start with a slight uptrend
    for (let i = 0; i < count; i++) {
      // More realistic price movement with slight upward bias
      const volatility = 0.005 // 0.5% max change typically
      const changePercent = Math.random() * volatility * 2 - volatility + 0.0002 // Slight upward bias
      currentPrice = currentPrice * (1 + changePercent)

      // Add some small patterns
      if (i % 20 === 0) {
        // Small correction every 20 points
        currentPrice = currentPrice * 0.995
      }

      if (i > count - 15) {
        // Final uptrend at the end
        currentPrice = currentPrice * 1.001
      }

      data.push(currentPrice)
    }

    return data
  }

  useEffect(() => {
    if (!canvasRef.current) return

    setIsLoading(true)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Ensure the chart is visible
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Generate data
    const priceData = generatePriceData()

    // Find min and max for scaling
    const minPrice = Math.min(...priceData) * 0.99
    const maxPrice = Math.max(...priceData) * 1.01
    const priceRange = maxPrice - minPrice

    // Draw chart background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw grid lines
    ctx.strokeStyle = "#e9ecef"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = rect.height - (i / gridLines) * rect.height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // Draw price line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    priceData.forEach((price, index) => {
      const x = (index / (priceData.length - 1)) * rect.width
      const y = rect.height - ((price - minPrice) / priceRange) * rect.height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Add gradient fill below the line
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    gradient.addColorStop(0, `${color}30`) // 30% opacity
    gradient.addColorStop(1, `${color}05`) // 5% opacity

    ctx.fillStyle = gradient
    ctx.beginPath()

    // Start from the bottom left
    ctx.moveTo(0, rect.height)

    // Draw the line again
    priceData.forEach((price, index) => {
      const x = (index / (priceData.length - 1)) * rect.width
      const y = rect.height - ((price - minPrice) / priceRange) * rect.height
      ctx.lineTo(x, y)
    })

    // Complete the path to the bottom right
    ctx.lineTo(rect.width, rect.height)
    ctx.closePath()
    ctx.fill()

    // Add price labels with better formatting
    ctx.fillStyle = "#6c757d"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"

    // Current price (last price)
    const currentPrice = priceData[priceData.length - 1]
    ctx.fillText(`$${currentPrice.toFixed(4)}`, 10, 20)

    // Min price
    ctx.fillText(`Low: $${minPrice.toFixed(4)}`, 10, rect.height - 10)

    // Max price
    ctx.fillText(`High: $${maxPrice.toFixed(4)}`, 10, 40)

    // Add timeframe label
    ctx.textAlign = "right"
    ctx.fillText(`Timeframe: ${timeframe}`, rect.width - 10, rect.height - 10)

    setIsLoading(false)

    // Simulate price updates
    const interval = setInterval(() => {
      if (!canvasRef.current) return

      // Get the last price
      const lastPrice = priceData[priceData.length - 1]

      // Generate a new price with small random change
      const changePercent = Math.random() * 0.004 - 0.001 // -0.1% to +0.3%
      const newPrice = lastPrice * (1 + changePercent)

      // Add new price and remove oldest
      priceData.push(newPrice)
      priceData.shift()

      // Recalculate min and max
      const newMinPrice = Math.min(...priceData) * 0.99
      const newMaxPrice = Math.max(...priceData) * 1.01
      const newPriceRange = newMaxPrice - newMinPrice

      // Redraw chart
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Draw chart background
      ctx.fillStyle = "#f8f9fa"
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Draw grid lines
      ctx.strokeStyle = "#e9ecef"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= gridLines; i++) {
        const y = rect.height - (i / gridLines) * rect.height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(rect.width, y)
        ctx.stroke()
      }

      // Draw price line
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      priceData.forEach((price, index) => {
        const x = (index / (priceData.length - 1)) * rect.width
        const y = rect.height - ((price - newMinPrice) / newPriceRange) * rect.height

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add gradient fill below the line
      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
      gradient.addColorStop(0, `${color}30`) // 30% opacity
      gradient.addColorStop(1, `${color}05`) // 5% opacity

      ctx.fillStyle = gradient
      ctx.beginPath()

      // Start from the bottom left
      ctx.moveTo(0, rect.height)

      // Draw the line again
      priceData.forEach((price, index) => {
        const x = (index / (priceData.length - 1)) * rect.width
        const y = rect.height - ((price - newMinPrice) / newPriceRange) * rect.height
        ctx.lineTo(x, y)
      })

      // Complete the path to the bottom right
      ctx.lineTo(rect.width, rect.height)
      ctx.closePath()
      ctx.fill()

      // Add price labels with better formatting
      ctx.fillStyle = "#6c757d"
      ctx.font = "12px Arial"

      ctx.textAlign = "left"

      // Current price (last price)
      ctx.fillText(`$${newPrice.toFixed(4)}`, 10, 20)

      // Min price
      ctx.fillText(`Low: $${newMinPrice.toFixed(4)}`, 10, rect.height - 10)

      // Max price
      ctx.fillText(`High: $${newMaxPrice.toFixed(4)}`, 10, 40)

      // Add timeframe label
      ctx.textAlign = "right"
      ctx.fillText(`Timeframe: ${timeframe}`, rect.width - 10, rect.height - 10)
    }, 2000)

    return () => clearInterval(interval)
  }, [timeframe, color])

  return (
    <div className="w-full h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0B90B]"></div>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

