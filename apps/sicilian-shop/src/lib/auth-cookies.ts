import "server-only"
import { cookies as nextCookies } from "next/headers"

const AUTH_COOKIE = "sicilian_shop_jwt"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | Record<string, never>
> => {
  const cookies = await nextCookies()
  const token = cookies.get(AUTH_COOKIE)?.value

  if (!token) return {}

  return { authorization: `Bearer ${token}` }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set(AUTH_COOKIE, token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set(AUTH_COOKIE, "", { maxAge: -1, path: "/" })
}
