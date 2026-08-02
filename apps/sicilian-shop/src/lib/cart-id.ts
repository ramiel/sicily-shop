const CART_ID_COOKIE = "sicilian_cart_id"

export function getCartId(): string | undefined {
  if (typeof document === "undefined") return undefined

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CART_ID_COOKIE}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

export function setCartId(cartId: string) {
  if (typeof document === "undefined") return

  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${CART_ID_COOKIE}=${encodeURIComponent(cartId)}; path=/; max-age=${oneYear}; samesite=lax`
}
