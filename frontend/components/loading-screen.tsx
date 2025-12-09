"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 mx-auto border-4 border-white/20 border-t-pink-500 rounded-full animate-spin" />
        <p className="text-white text-lg font-light">Loading your wrapped...</p>
      </motion.div>
    </div>
  )
}
