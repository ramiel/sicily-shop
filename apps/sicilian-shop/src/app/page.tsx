import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { listCategories, listProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { TrinacriaMark } from "@/components/trinacria-mark";
import { blogPosts } from "@/content/blog";

const CATEGORY_ICON: Record<string, string> = {
  "Caltagirone Ceramics": "/products/testa-di-moro.svg",
  "Coral & Jewelry": "/products/collana-corallo.svg",
  "Baskets & Textiles": "/products/cesta-vimini.svg",
  "Olive Wood": "/products/tagliere-ulivo.svg",
  "Pupi & Decor": "/products/pupo-siciliano.svg",
};

const CATEGORY_NOTE: Record<string, string> = {
  "Caltagirone Ceramics": "Tin-glazed majolica, hand-painted since the 1600s.",
  "Coral & Jewelry": "Red coral from the banks off Sciacca, set in silver.",
  "Baskets & Textiles": "Cane, wicker and linen, worked by hand.",
  "Olive Wood": "Carved from branches pruned off working groves.",
  "Pupi & Decor": "Knights and carts from the Opera dei Pupi tradition.",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
});

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    listCategories(),
    listProducts(),
  ]);

  const featured = products.slice(0, 4);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cotto-deep">
              <TrinacriaMark className="h-4 w-4" />
              Handmade across Sicily
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] text-inchiostro sm:text-6xl">
              The island, kept on a shelf.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-inchiostro-soft">
              Ceramics from Caltagirone, coral from Sciacca, olive wood from
              working groves — bought straight from the workshops that make
              them, not a souvenir stand.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/store">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-cotto hover:bg-cotto-deep"
                >
                  Shop the workshops
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Read the journal
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl bg-calce-deep"
              >
                {product.thumbnail && (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="aspect-square w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rim-divider" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
          Five workshops
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium text-inchiostro">
          Every piece traces back to a maker
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/store?category=${category.handle}`}
              className="group flex items-center gap-4 rounded-2xl bg-surface-warm p-5 transition-shadow hover:shadow-[0_8px_28px_-12px_rgba(42,36,32,0.25)]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-calce-deep">
                {CATEGORY_ICON[category.name] && (
                  <Image
                    src={CATEGORY_ICON[category.name]}
                    alt=""
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-inchiostro">
                  {category.name}
                </h3>
                <p className="mt-0.5 text-sm text-inchiostro-soft">
                  {CATEGORY_NOTE[category.name]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
              New in the shop
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium text-inchiostro">
              Recently added
            </h2>
          </div>
          <Link
            href="/store"
            className="hidden font-mono text-sm text-maiolica hover:underline sm:block"
          >
            Shop all →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div className="rim-divider" />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
          The journal
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium text-inchiostro">
          Notes from the workshops
        </h2>

        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-3">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="overflow-hidden rounded-2xl bg-calce-deep">
                <Image
                  src={post.cover}
                  alt=""
                  width={800}
                  height={450}
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
                {dateFormatter.format(new Date(post.date))}
              </p>
              <h3 className="mt-1 font-display text-lg font-medium leading-snug text-inchiostro">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
