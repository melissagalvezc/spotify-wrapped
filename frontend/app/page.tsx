"use client"

import { useState, useEffect } from "react"
import { WrappedSlide } from "@/components/wrapped-slide"
import { NavigationControls } from "@/components/navigation-controls"
import { LoadingScreen } from "@/components/loading-screen"

interface WrappedData {
  topTrack: { name: string; artist: string; play_count: number } | null
  topArtist: { name: string; play_count: number } | null
  topGenre: { name: string; play_count: number } | null
}

export default function Home() {
  const [data, setData] = useState<WrappedData | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trackRes, artistRes, genreRes] = await Promise.all([
          fetch("/api/top-track"),
          fetch("/api/top-artist"),
          fetch("/api/top-genre"),
        ])

        const topTrack = await trackRes.json()
        const topArtist = await artistRes.json()
        const topGenre = await genreRes.json()

        setData({ topTrack, topArtist, topGenre })
      } catch (error) {
        console.error("Error fetching wrapped data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  const slides = [
    { type: "intro" as const },
    { type: "track" as const, data: data?.topTrack },
    { type: "artist" as const, data: data?.topArtist },
    { type: "genre" as const, data: data?.topGenre },
    { type: "summary" as const, data },
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black overflow-hidden">
      <div className="relative h-screen flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        </div>

        {/* Slide content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <WrappedSlide slide={slides[currentSlide]} slideIndex={currentSlide} onNext={handleNext} />
        </div>

        {/* Navigation controls */}
        <NavigationControls
          currentSlide={currentSlide}
          totalSlides={slides.length}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-8 bg-pink-500" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
