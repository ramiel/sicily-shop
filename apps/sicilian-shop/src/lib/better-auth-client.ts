import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const authClient = createAuthClient({
  baseURL: `${MEDUSA_BACKEND_URL}/better-auth`,
  fetchOptions: { credentials: "include" },
  plugins: [emailOTPClient()],
})
