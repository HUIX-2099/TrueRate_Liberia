import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrueRate Liberia",
    short_name: "TrueRate",
    description:
      "Real-time USD/LRD exchange rates, analytics, and AI-powered predictions for Liberia.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0A",
    theme_color: "#16A34A",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/placeholder-logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
    shortcuts: [
      { name: "Converter", url: "/converter" },
      { name: "Analytics", url: "/analytics" },
      { name: "Predictions", url: "/predictions" },
    ],
    categories: ["finance", "productivity"],
    id: "/",
    lang: "en",
    dir: "ltr",
  }
}
