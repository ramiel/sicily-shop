"use client"

import Link from "next/link"
import { Badge } from "@heroui/react"
import { useExistingCart } from "@/hooks/use-cart"

export function CartBadge() {
  const { data: cart } = useExistingCart()

  const count =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex items-center justify-center rounded-full p-2 text-inchiostro transition-colors hover:bg-calce-deep"
    >
      <Badge.Anchor>
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 7V6a6 6 0 0 1 12 0v1" />
          <path d="M4.5 7h15l-1.1 12.1a2 2 0 0 1-2 1.9H7.6a2 2 0 0 1-2-1.9L4.5 7Z" />
        </svg>
        {count > 0 && (
          <Badge color="accent" size="sm">
            {count}
          </Badge>
        )}
      </Badge.Anchor>
    </Link>
  )
}
