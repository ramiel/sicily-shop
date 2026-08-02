import { cache } from "react"
import { sdk } from "@/lib/medusa"
import { getRegion } from "@/lib/region"

const PRODUCT_FIELDS =
  "id,title,handle,description,thumbnail,*images,*categories,*options,*options.values,*variants,*variants.options,*variants.calculated_price"

// The Medusa backend behind this storefront is shared with the default
// Medusa demo storefront, which seeds its own T-shirt/merch catalog into the
// same sales channel. Scoping every query to these categories keeps this
// shop showing only the Sicilian craft catalog it seeded.
const SHOP_CATEGORY_NAMES = [
  "Caltagirone Ceramics",
  "Coral & Jewelry",
  "Baskets & Textiles",
  "Olive Wood",
  "Pupi & Decor",
]

export const listCategories = cache(async () => {
  const { product_categories } = await sdk.store.category.list({
    fields: "id,name,handle",
    name: SHOP_CATEGORY_NAMES,
  })
  return product_categories
})

export const listProducts = cache(
  async (params: { category_id?: string } = {}) => {
    const region = await getRegion()

    const categoryIds = params.category_id
      ? [params.category_id]
      : (await listCategories()).map((c) => c.id)

    const { products } = await sdk.store.product.list({
      fields: PRODUCT_FIELDS,
      region_id: region?.id,
      category_id: categoryIds,
      limit: 100,
    })

    return products
  }
)

export const getProductByHandle = cache(async (handle: string) => {
  const region = await getRegion()

  const { products } = await sdk.store.product.list({
    fields: PRODUCT_FIELDS,
    region_id: region?.id,
    handle,
    limit: 1,
  })

  return products[0]
})

export function cheapestPrice(product: {
  variants?: Array<{ calculated_price?: { calculated_amount?: number | null; currency_code?: string | null } | null }> | null
}) {
  const amounts =
    product.variants
      ?.map((v) => v.calculated_price?.calculated_amount)
      .filter((a): a is number => typeof a === "number") ?? []

  if (!amounts.length) return null

  const currency = product.variants?.[0]?.calculated_price?.currency_code
  return { amount: Math.min(...amounts), currency_code: currency }
}

export function formatPrice(amount: number, currencyCode?: string | null) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: currencyCode || "eur",
  }).format(amount)
}
