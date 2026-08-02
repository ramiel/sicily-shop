"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/medusa"
import { getCartId, setCartId } from "@/lib/cart-id"

const CART_FIELDS =
  "*items,*items.product,*items.variant,*items.variant.options,+items.thumbnail,*region"

async function fetchOrCreateCart(regionId?: string) {
  const existingId = getCartId()

  if (existingId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(existingId, {
        fields: CART_FIELDS,
      })
      return cart
    } catch {
      // Falls through to create a new cart if the stored id is stale.
    }
  }

  const { cart } = await sdk.store.cart.create({ region_id: regionId })
  setCartId(cart.id)
  return cart
}

export function useCart(regionId?: string) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchOrCreateCart(regionId),
  })
}

/**
 * Reads the cart only if one already exists (from the id cookie), so
 * viewing the header badge never triggers a cart-create request for a
 * visitor who hasn't added anything yet.
 */
export function useExistingCart() {
  const cartId = getCartId()

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { cart } = await sdk.store.cart.retrieve(cartId!, {
        fields: CART_FIELDS,
      })
      return cart
    },
    enabled: !!cartId,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      variantId,
      quantity,
      regionId,
    }: {
      variantId: string
      quantity: number
      regionId?: string
    }) => {
      const cart = await fetchOrCreateCart(regionId)
      const { cart: updated } = await sdk.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
      return updated
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
    },
  })
}

export function useUpdateLineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cartId,
      lineId,
      quantity,
    }: {
      cartId: string
      lineId: string
      quantity: number
    }) => {
      const { cart } = await sdk.store.cart.updateLineItem(cartId, lineId, {
        quantity,
      })
      return cart
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
    },
  })
}

export function useRemoveLineItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      cartId,
      lineId,
    }: {
      cartId: string
      lineId: string
    }) => {
      const { parent } = await sdk.store.cart.deleteLineItem(cartId, lineId)
      return parent
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(["cart"], cart)
    },
  })
}
