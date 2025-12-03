"use client"

import { motion } from "framer-motion"

interface SeriesHeaderProps {
  number: string
  title: string
  subtitle?: string
  meta?: string
}

export function SeriesHeader({ number, title, subtitle, meta }: SeriesHeaderProps) {
  return (
    <motion.div
      className="doc-header relative mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="display-number">{number}</div>

      <div className="flex-1">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-5xl md:text-7xl font-black text-black">{number}</span>
          <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-sm md:text-base text-black/70 font-mono max-w-2xl">{subtitle}</p>}
      </div>

      {meta && (
        <div className="hidden md:flex flex-col items-end text-right">
          <p className="text-xs font-mono text-black/60 uppercase tracking-wider">{meta}</p>
        </div>
      )}
    </motion.div>
  )
}
