import { redirect } from "next/navigation"
import { retrieveCustomer } from "@/lib/customer"
import { LogoutButton } from "@/components/logout-button"

export const metadata = {
  title: "Your account — Bottega Sicula",
}

export default async function AccountPage() {
  const customer = await retrieveCustomer()
  if (!customer) redirect("/login")

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
        Your account
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-inchiostro">
        {customer.first_name ? `Ciao, ${customer.first_name}` : "Ciao"}
      </h1>

      <div className="mt-8 rounded-2xl bg-surface-warm p-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft">
          Email
        </p>
        <p className="mt-1 text-inchiostro">{customer.email}</p>
      </div>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  )
}
