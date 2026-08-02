import Link from "next/link"
import { TrinacriaMark } from "@/components/trinacria-mark"
import { listCategories } from "@/lib/products"

export async function SiteFooter() {
  const categories = await listCategories().catch(() => [])

  return (
    <footer className="mt-24 bg-maiolica text-calce">
      <div className="rim-divider rim-divider--inverse" />
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-medium">
            <TrinacriaMark className="h-6 w-6 text-zafferana" />
            Bottega Sicula
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-calce/75">
            Ceramics, coral, olive wood and textiles made by artisans across
            Sicily — one workshop at a time.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-calce/60">
            Shop
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/store?category=${category.handle}`}
                  className="text-calce/85 transition-colors hover:text-zafferana"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-calce/60">
            Bottega
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/blog"
                className="text-calce/85 transition-colors hover:text-zafferana"
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                href="/store"
                className="text-calce/85 transition-colors hover:text-zafferana"
              >
                All products
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-calce/15 px-6 py-5 text-center font-mono text-xs text-calce/60">
        © {new Date().getFullYear()} Bottega Sicula. Made in Sicily.
      </div>
    </footer>
  )
}
