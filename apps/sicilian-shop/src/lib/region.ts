import { cache } from "react"
import { sdk } from "@/lib/medusa"

const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "it"

export const getRegion = cache(async () => {
  const { regions } = await sdk.store.region.list()

  const region =
    regions.find((r) =>
      r.countries?.some((c) => c.iso_2 === DEFAULT_COUNTRY_CODE)
    ) || regions[0]

  return region
})
