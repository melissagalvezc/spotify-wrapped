"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationControlsProps {
  currentSlide: number
  totalSlides: number
  onNext: () => void
  onPrev: () => void
}

export function NavigationControls({ currentSlide, totalSlides, onNext, onPrev }: NavigationControlsProps) {
  return (
    <div className="absolute bottom-8 right-8 z-20 flex gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrev}
        disabled={currentSlide === 0}
        className={`p-3 rounded-full backdrop-blur-md border transition-all ${
          currentSlide === 0
            ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
        }`}
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className={`p-3 rounded-full backdrop-blur-md border transition-all ${
          currentSlide === totalSlides - 1
            ? "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
        }`}
      >
        <ChevronRight size={24} />
      </motion.button>
    </div>
  )
}
