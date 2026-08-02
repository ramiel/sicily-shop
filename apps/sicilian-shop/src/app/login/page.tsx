import { redirect } from "next/navigation"
import { retrieveCustomer } from "@/lib/customer"
import { OtpLoginForm } from "@/components/otp-login-form"

export const metadata = {
  title: "Log in — Bottega Sicula",
}

export default async function LoginPage() {
  const customer = await retrieveCustomer()
  if (customer) redirect("/account")

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cotto-deep">
        Welcome
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-inchiostro">
        Log in with a code
      </h1>
      <p className="mt-3 text-sm text-inchiostro-soft">
        No password to remember — we'll email you a one-time code.
      </p>
      <div className="mt-8">
        <OtpLoginForm />
      </div>
    </div>
  )
}
