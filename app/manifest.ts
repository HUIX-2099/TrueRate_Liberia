import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TrueRate Liberia",
    short_name: "TrueRate",
    description:
      "Trusted rates, prices, and practical money tools for everyday decisions in Liberia.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0A0A0A",
    theme_color: "#16A34A",
    icons: [
      { src: "/icons/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/logo-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/logo-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/logo-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/icons/logo-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
      { src: "/icons/logo-64.png", sizes: "64x64", type: "image/png", purpose: "any" },
      { src: "/icons/logo-48.png", sizes: "48x48", type: "image/png", purpose: "any" },
      { src: "/icons/logo-32.png", sizes: "32x32", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "Converter", url: "/converter" },
      { name: "Today's Market", url: "/market" },
      { name: "Predictions", url: "/predictions" },
    ],
    categories: ["finance", "productivity"],
    id: "/",
    lang: "en",
    dir: "ltr",
  }
}
