import Link from "next/link"
import { TrinacriaMark } from "@/components/trinacria-mark"
import { CartBadge } from "@/components/cart-badge"
import { retrieveCustomer } from "@/lib/customer"

const NAV_LINKS = [
  { href: "/store", label: "Shop" },
  { href: "/blog", label: "Journal" },
]

export async function SiteHeader() {
  const customer = await retrieveCustomer()

  return (
    <header className="sticky top-0 z-40 border-b border-sabbia-border/70 bg-calce/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-medium tracking-tight text-inchiostro"
        >
          <TrinacriaMark className="h-7 w-7 text-cotto" />
          Bottega Sicula
        </Link>

        <nav className="hidden items-center gap-8 font-sans text-[0.95rem] font-medium text-inchiostro-soft sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-maiolica"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={customer ? "/account" : "/login"}
            className="hidden font-sans text-[0.95rem] font-medium text-inchiostro-soft transition-colors hover:text-maiolica sm:block"
          >
            {customer ? customer.first_name || "Account" : "Log in"}
          </Link>
          <CartBadge />
        </div>
      </div>
      <div className="rim-divider" />
    </header>
  )
}
