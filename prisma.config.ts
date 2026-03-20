import "dotenv/config"
import { defineConfig } from "prisma/config"

// Prisma 7.x: connection URL lives here for Migrate/Studio; runtime uses lib/db/prisma.ts
// Placeholder used when DATABASE_URL is unset so `prisma generate` works without a .env
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/truerate"

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
} as Parameters<typeof defineConfig>[0])
