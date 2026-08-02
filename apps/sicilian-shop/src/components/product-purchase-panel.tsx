"use client"

import { useMemo, useState } from "react"
import { Button } from "@heroui/react"
import { useAddToCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/products"

type Variant = {
  id: string
  title?: string | null
  options?: Array<{ option?: { title?: string } | null; value?: string | null }> | null
  calculated_price?: { calculated_amount?: number | null; currency_code?: string | null } | null
}

type ProductOption = {
  id: string
  title: string
  values?: Array<{ id: string; value: string }> | null
}

export function ProductPurchasePanel({
  options,
  variants,
  regionId,
}: {
  options: ProductOption[]
  variants: Variant[]
  regionId?: string
}) {
  const hasRealOptions = options.some((o) => (o.values?.length ?? 0) > 1)

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const option of options) {
      const firstValue = option.values?.[0]?.value
      if (firstValue) initial[option.title] = firstValue
    }
    return initial
  })
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const matchedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.options?.every(
        (o) => o.option?.title && selected[o.option.title] === o.value
      )
    )
  }, [variants, selected])

  const addToCart = useAddToCart()

  const price = matchedVariant?.calculated_price

  return (
    <div className="space-y-6">
      {price?.calculated_amount != null && (
        <p className="font-mono text-2xl text-cotto-deep">
          {formatPrice(price.calculated_amount, price.currency_code)}
        </p>
      )}

      {hasRealOptions &&
        options.map((option) => (
          <div key={option.id}>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
              {option.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {option.values?.map((value) => {
                const isSelected = selected[option.title] === value.value
                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() =>
                      setSelected((prev) => ({
                        ...prev,
                        [option.title]: value.value,
                      }))
                    }
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      isSelected
                        ? "border-maiolica bg-maiolica text-calce"
                        : "border-sabbia-border bg-surface-warm text-inchiostro hover:border-maiolica"
                    }`}
                  >
                    {value.value}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
          Quantity
        </p>
        <div className="mt-2 inline-flex items-center rounded-full border border-sabbia-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center text-lg text-inchiostro hover:text-maiolica"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="flex h-9 w-9 items-center justify-center text-lg text-inchiostro hover:text-maiolica"
          >
            +
          </button>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        isDisabled={!matchedVariant}
        isPending={addToCart.isPending}
        onPress={() => {
          if (!matchedVariant) return
          addToCart.mutate(
            { variantId: matchedVariant.id, quantity, regionId },
            {
              onSuccess: () => {
                setJustAdded(true)
                setTimeout(() => setJustAdded(false), 2000)
              },
            }
          )
        }}
        className="bg-cotto text-calce hover:bg-cotto-deep"
      >
        {justAdded ? "Added to cart" : "Add to cart"}
      </Button>

      {addToCart.isError && (
        <p className="text-sm text-danger">
          Something went wrong adding this to your cart. Please try again.
        </p>
      )}

      <p className="font-sans text-xs leading-relaxed text-inchiostro-soft">
        Handmade by Sicilian artisans — small variations in glaze, grain and
        color are part of the piece, not a flaw.
      </p>
    </div>
  )
}
