"use client"

import { motion } from "framer-motion"

interface SlideProps {
  slide: {
    type: "intro" | "track" | "artist" | "genre" | "summary"
    data?: any
  }
  slideIndex: number
  onNext?: () => void
}

export function WrappedSlide({ slide, slideIndex, onNext }: SlideProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  if (slide.type === "intro") {
    return (
      <motion.div
        key="intro"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 px-6"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-balance">
            Your 2025
          </h1>
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
            Wrapped
          </h2>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/70 font-light max-w-2xl">
          Discover your year in music
        </motion.p>

        <motion.div variants={itemVariants} className="pt-8">
          <button
            onClick={onNext}
            className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            Scroll down to continue →
          </button>
        </motion.div>
      </motion.div>
    )
  }

  if (slide.type === "track" && slide.data) {
    return (
      <motion.div
        key="track"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 px-6"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-white text-sm font-semibold uppercase tracking-wider">
              Your Top Track
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-6xl md:text-7xl font-black text-white text-balance">
            {slide.data.name}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-2xl md:text-3xl text-pink-300 font-light">
            by {slide.data.artist}
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-white/60 text-lg">
              You played this track <span className="font-bold text-white">{slide.data.play_count} times</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (slide.type === "artist" && slide.data) {
    return (
      <motion.div
        key="artist"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 px-6"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-sm font-semibold uppercase tracking-wider">
              Your Top Artist
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-6xl md:text-7xl font-black text-white text-balance">
            {slide.data.name}
          </motion.h2>

          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-white/60 text-lg">
              Streamed <span className="font-bold text-purple-300">{slide.data.play_count} times</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (slide.type === "genre" && slide.data) {
    return (
      <motion.div
        key="genre"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8 px-6"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants}>
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-sm font-semibold uppercase tracking-wider">
              Your Top Genre
            </div>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-6xl md:text-7xl font-black text-white text-balance">
            {slide.data.name}
          </motion.h2>

          <motion.div variants={itemVariants} className="pt-4">
            <p className="text-white/60 text-lg">
              {slide.data.play_count} <span className="text-blue-300 font-semibold">total plays</span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (slide.type === "summary" && slide.data) {
    return (
      <motion.div
        key="summary"
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -90 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12 px-6 perspective"
      >
        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black text-white">
          Your 2025 Summary
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Track Card */}
          {slide.data.topTrack && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-400/30 backdrop-blur-sm"
            >
              <p className="text-pink-300 text-sm font-semibold mb-2">TOP TRACK</p>
              <p className="text-white font-bold text-lg">{slide.data.topTrack.name}</p>
              <p className="text-pink-200 text-sm mt-1">{slide.data.topTrack.artist}</p>
            </motion.div>
          )}

          {/* Artist Card */}
          {slide.data.topArtist && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm"
            >
              <p className="text-purple-300 text-sm font-semibold mb-2">TOP ARTIST</p>
              <p className="text-white font-bold text-lg">{slide.data.topArtist.name}</p>
              <p className="text-purple-200 text-sm mt-1">{slide.data.topArtist.play_count} plays</p>
            </motion.div>
          )}

          {/* Genre Card */}
          {slide.data.topGenre && (
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-sm"
            >
              <p className="text-blue-300 text-sm font-semibold mb-2">TOP GENRE</p>
              <p className="text-white font-bold text-lg">{slide.data.topGenre.name}</p>
              <p className="text-blue-200 text-sm mt-1">{slide.data.topGenre.play_count} plays</p>
            </motion.div>
          )}
        </motion.div>

        <motion.p variants={itemVariants} className="text-white/70 text-lg">
          Thanks for the amazing year. Here's to 2026!
        </motion.p>
      </motion.div>
    )
  }

  return null
}
