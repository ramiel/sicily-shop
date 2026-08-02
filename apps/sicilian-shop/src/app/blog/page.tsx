import Image from "next/image"
import Link from "next/link"
import { blogPosts } from "@/content/blog"

export const metadata = {
  title: "Journal — Bottega Sicula",
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
        The journal
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-4xl font-medium text-inchiostro">
        Notes from the workshops
      </h1>
      <p className="mt-3 max-w-xl text-inchiostro-soft">
        Short histories of the crafts, towns and makers behind what we sell —
        written by the people who buy from them.
      </p>

      <Link href={`/blog/${featured.slug}`} className="group mt-10 block">
        <div className="grid gap-6 rounded-3xl bg-surface-warm p-4 sm:grid-cols-2 sm:p-6">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={featured.cover}
              alt=""
              width={800}
              height={450}
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
              {featured.category} · {dateFormatter.format(new Date(featured.date))}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium text-inchiostro">
              {featured.title}
            </h2>
            <p className="mt-3 text-inchiostro-soft">{featured.excerpt}</p>
            <p className="mt-4 font-mono text-xs text-maiolica">
              {featured.readMinutes} min read →
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
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
              {post.category} · {dateFormatter.format(new Date(post.date))}
            </p>
            <h2 className="mt-1 font-display text-lg font-medium leading-snug text-inchiostro">
              {post.title}
            </h2>
            <p className="mt-2 text-sm text-inchiostro-soft">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
