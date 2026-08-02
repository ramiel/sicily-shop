import "server-only"
import { cookies as nextCookies } from "next/headers"

const CART_ID_COOKIE = "sicilian_cart_id"

export async function getCartId() {
  const cookies = await nextCookies()
  return cookies.get(CART_ID_COOKIE)?.value
}
