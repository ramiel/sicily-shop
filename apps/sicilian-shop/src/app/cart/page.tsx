"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@heroui/react"
import { useCart, useRemoveLineItem, useUpdateLineItem } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/products"

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const updateLineItem = useUpdateLineItem()
  const removeLineItem = useRemoveLineItem()

  const items = cart?.items ?? []

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl font-medium text-inchiostro">
        Your cart
      </h1>

      {isLoading && (
        <p className="mt-8 text-inchiostro-soft">Loading your cart…</p>
      )}

      {!isLoading && items.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-inchiostro-soft">
            Your cart is empty — nothing from the workshop yet.
          </p>
          <Link href="/store" className="mt-4 inline-block">
            <Button variant="primary" className="bg-cotto hover:bg-cotto-deep">
              Browse the shop
            </Button>
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-sabbia-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6">
                {item.thumbnail && (
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-calce-deep">
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? ""}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-display text-lg font-medium text-inchiostro">
                      {item.product_title}
                    </p>
                    {item.variant_title && (
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-inchiostro-soft">
                        {item.variant_title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-sabbia-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={updateLineItem.isPending}
                        onClick={() =>
                          cart &&
                          updateLineItem.mutate({
                            cartId: cart.id,
                            lineId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center text-inchiostro hover:text-maiolica"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={updateLineItem.isPending}
                        onClick={() =>
                          cart &&
                          updateLineItem.mutate({
                            cartId: cart.id,
                            lineId: item.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center text-inchiostro hover:text-maiolica"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={removeLineItem.isPending}
                      onClick={() =>
                        cart &&
                        removeLineItem.mutate({
                          cartId: cart.id,
                          lineId: item.id,
                        })
                      }
                      className="font-mono text-xs uppercase tracking-[0.1em] text-cotto-deep hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-mono text-sm text-inchiostro">
                  {formatPrice(item.subtotal ?? 0, cart?.currency_code)}
                </p>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-2xl bg-surface-warm p-6">
            <div className="flex justify-between text-sm text-inchiostro-soft">
              <span>Subtotal</span>
              <span className="font-mono">
                {formatPrice(cart?.item_total ?? 0, cart?.currency_code)}
              </span>
            </div>
            <div className="mt-2 flex justify-between font-medium text-inchiostro">
              <span>Total</span>
              <span className="font-mono">
                {formatPrice(cart?.total ?? 0, cart?.currency_code)}
              </span>
            </div>
            <Button
              variant="primary"
              fullWidth
              isDisabled
              className="mt-6 bg-cotto hover:bg-cotto-deep"
            >
              Checkout coming soon
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
