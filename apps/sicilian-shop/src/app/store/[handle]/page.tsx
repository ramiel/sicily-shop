import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@/lib/products"
import { getRegion } from "@/lib/region"
import { ProductPurchasePanel } from "@/components/product-purchase-panel"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const [product, region] = await Promise.all([
    getProductByHandle(handle),
    getRegion(),
  ])

  if (!product) {
    notFound()
  }

  const category = product.categories?.[0]

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <nav className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
        <Link href="/store" className="hover:text-maiolica">
          Shop
        </Link>
        {category && (
          <>
            {" / "}
            <Link
              href={`/store?category=${category.handle}`}
              className="hover:text-maiolica"
            >
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-calce-deep">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl font-medium leading-tight text-inchiostro sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-4 leading-relaxed text-inchiostro-soft">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductPurchasePanel
              options={product.options ?? []}
              variants={product.variants ?? []}
              regionId={region?.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
