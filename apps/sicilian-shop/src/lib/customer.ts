import "server-only"
import { sdk } from "@/lib/medusa"
import { getAuthHeaders } from "@/lib/auth-cookies"

export async function retrieveCustomer() {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) return null

  return sdk.store.customer
    .retrieve({}, headers)
    .then(({ customer }) => customer)
    .catch(() => null)
}
