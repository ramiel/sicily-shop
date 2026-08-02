import Link from "next/link"
import { listCategories, listProducts } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export const metadata = {
  title: "Shop — Bottega Sicula",
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categoryHandle } = await searchParams

  const categories = await listCategories()
  const activeCategory = categoryHandle
    ? categories.find((c) => c.handle === categoryHandle)
    : undefined

  const products = await listProducts({ category_id: activeCategory?.id })

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
          The shop
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium text-inchiostro">
          {activeCategory ? activeCategory.name : "Every workshop, one shelf"}
        </h1>
        <p className="mt-3 text-inchiostro-soft">
          {products.length} piece{products.length === 1 ? "" : "s"}, each made
          by hand somewhere on the island.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/store"
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !activeCategory
              ? "border-maiolica bg-maiolica text-calce"
              : "border-sabbia-border text-inchiostro hover:border-maiolica"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/store?category=${category.handle}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeCategory?.id === category.id
                ? "border-maiolica bg-maiolica text-calce"
                : "border-sabbia-border text-inchiostro hover:border-maiolica"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-16 text-center text-inchiostro-soft">
          Nothing here yet — check back soon, or browse another workshop.
        </p>
      )}
    </div>
  )
}
