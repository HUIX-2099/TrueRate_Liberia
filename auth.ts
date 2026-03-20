import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const nextAuth = NextAuth(authConfig)

export const handlers = nextAuth.handlers
export const auth = nextAuth.auth
