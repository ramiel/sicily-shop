import { sdk } from "@/lib/medusa"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Once Better Auth has established a session (e.g. after emailOtp sign-in),
 * this exchanges it for a native Medusa customer token and persists that
 * token in our own httpOnly cookie, per the bridge flow documented at
 * https://github.com/nualt/medusa-plugin-better-auth#storefront-recipe
 */
export async function completeBetterAuthSignIn(email: string) {
  // Link this Better Auth identity to an existing customer, if any.
  await fetch(`${BACKEND_URL}/better-auth/bridge/link/customer`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {})

  const exchangeRes = await fetch(`${BACKEND_URL}/auth/customer/better-auth`, {
    method: "POST",
    credentials: "include",
  })
  if (!exchangeRes.ok) {
    throw new Error("Could not complete sign-in.")
  }
  const { token } = (await exchangeRes.json()) as { token: string }

  let finalToken = token
  const hasCustomer = await sdk.store.customer
    .retrieve({}, { authorization: `Bearer ${token}` })
    .then(() => true)
    .catch(() => false)

  if (!hasCustomer) {
    // First sign-in with this identity: create the customer record, then
    // refresh the token so it's bound to that customer as its actor.
    await sdk.store.customer.create(
      { email },
      {},
      { authorization: `Bearer ${token}` }
    )

    const refreshRes = await fetch(`${BACKEND_URL}/auth/token/refresh`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    })
    if (!refreshRes.ok) {
      throw new Error("Could not finish creating your account.")
    }
    finalToken = ((await refreshRes.json()) as { token: string }).token
  }

  const sessionRes = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: finalToken }),
  })
  if (!sessionRes.ok) {
    throw new Error("Could not save your session.")
  }
}
