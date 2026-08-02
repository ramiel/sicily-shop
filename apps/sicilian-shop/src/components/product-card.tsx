import Link from "next/link"
import Image from "next/image"
import { Card } from "@heroui/react"
import { cheapestPrice, formatPrice } from "@/lib/products"

type CardProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string | null
  categories?: Array<{ name: string }> | null
  variants?: Array<{
    calculated_price?: { calculated_amount?: number | null; currency_code?: string } | null
  }> | null
}

export function ProductCard({ product }: { product: CardProduct }) {
  const price = cheapestPrice(product)
  const category = product.categories?.[0]?.name

  return (
    <Link href={`/store/${product.handle}`} className="group block">
      <Card variant="transparent" className="p-0">
        <div className="overflow-hidden rounded-2xl bg-calce-deep">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={400}
              height={400}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>
        <Card.Content className="px-1 pt-3">
          {category && (
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-inchiostro-soft">
              {category}
            </p>
          )}
          <Card.Title className="mt-1 font-display text-lg font-medium leading-snug text-inchiostro">
            {product.title}
          </Card.Title>
          {price && (
            <p className="mt-1 font-mono text-sm text-cotto-deep">
              {formatPrice(price.amount, price.currency_code)}
            </p>
          )}
        </Card.Content>
      </Card>
    </Link>
  )
}
