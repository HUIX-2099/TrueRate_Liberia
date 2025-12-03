"use client"

import { motion } from "framer-motion"

export function SkeletonLoader() {
  return (
    <motion.div
      className="w-full h-32 bg-gray-100 border border-black"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Currency symbol animation */}
        <motion.text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="40"
          fontWeight="bold"
          fill="#000"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          $
        </motion.text>

        {/* Loading dots */}
        <motion.circle
          cx="20"
          cy="75"
          r="3"
          fill="#ff5722"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: 0 }}
        />
        <motion.circle
          cx="50"
          cy="75"
          r="3"
          fill="#ff5722"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <motion.circle
          cx="80"
          cy="75"
          r="3"
          fill="#ff5722"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
      </svg>
    </motion.div>
  )
}
