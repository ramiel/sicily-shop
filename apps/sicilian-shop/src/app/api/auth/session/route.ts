import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@/lib/medusa"
import { setAuthToken, removeAuthToken } from "@/lib/auth-cookies"
import { getCartId } from "@/lib/cart-id-server"

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const token = body?.token

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  await setAuthToken(token)

  const cartId = await getCartId()
  if (cartId) {
    await sdk.store.cart
      .transferCart(cartId, {}, { authorization: `Bearer ${token}` })
      .catch(() => {
        // Non-fatal: the customer just keeps shopping with a fresh cart.
      })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await removeAuthToken()
  return NextResponse.json({ ok: true })
}
