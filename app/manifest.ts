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
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any maskable" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any maskable" },
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
