import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blogPosts, getPostBySlug } from "@/content/blog"

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <Link
        href="/blog"
        className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft hover:text-maiolica"
      >
        ← Journal
      </Link>

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.15em] text-cotto-deep">
        {post.category} · {dateFormatter.format(new Date(post.date))} ·{" "}
        {post.readMinutes} min read
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium leading-tight text-inchiostro">
        {post.title}
      </h1>

      <div className="mt-8 overflow-hidden rounded-3xl">
        <Image
          src={post.cover}
          alt=""
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
          priority
        />
      </div>

      <div className="mt-10 space-y-5 text-[1.05rem] leading-relaxed text-inchiostro">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="rim-divider mt-14" />
      <p className="mt-8 text-center text-inchiostro-soft">
        Read more in the{" "}
        <Link href="/blog" className="text-maiolica hover:underline">
          journal
        </Link>
        , or browse the{" "}
        <Link href="/store" className="text-maiolica hover:underline">
          shop
        </Link>
        .
      </p>
    </article>
  )
}
