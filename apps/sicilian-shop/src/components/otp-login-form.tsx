"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { authClient } from "@/lib/better-auth-client"
import { completeBetterAuthSignIn } from "@/lib/auth-exchange"

const inputClass =
  "w-full rounded-xl border border-sabbia-border bg-surface-warm px-4 py-2.5 text-inchiostro placeholder:text-inchiostro-soft focus:outline-none focus:ring-2 focus:ring-maiolica"

export function OtpLoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sendCode = () => {
    setError(null)
    startTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      })
      if (error) {
        setError(
          error.message || "Couldn't send the code. Check the email and try again."
        )
        return
      }
      setStep("code")
    })
  }

  const verifyCode = () => {
    setError(null)
    startTransition(async () => {
      const { error } = await authClient.signIn.emailOtp({ email, otp: code })
      if (error) {
        setError(error.message || "That code didn't work. Check and try again.")
        return
      }

      try {
        await completeBetterAuthSignIn(email)
        router.push("/account")
        router.refresh()
      } catch {
        setError(
          "You're signed in, but we couldn't finish setting up your account. Try refreshing this page."
        )
      }
    })
  }

  if (step === "code") {
    return (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          verifyCode()
        }}
      >
        <p className="text-sm text-inchiostro-soft">
          We sent a 6-digit code to <span className="text-inchiostro">{email}</span>.
        </p>

        <div>
          <label
            htmlFor="code"
            className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft"
          >
            Code
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`mt-2 text-center font-mono text-lg tracking-[0.3em] ${inputClass}`}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={isPending}
          className="bg-cotto hover:bg-cotto-deep"
        >
          Confirm code
        </Button>

        <button
          type="button"
          onClick={() => {
            setStep("email")
            setCode("")
            setError(null)
          }}
          className="w-full text-center text-sm text-maiolica hover:underline"
        >
          Use a different email
        </button>
      </form>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        sendCode()
      }}
    >
      <div>
        <label
          htmlFor="email"
          className="font-mono text-xs uppercase tracking-[0.15em] text-inchiostro-soft"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isPending={isPending}
        className="bg-cotto hover:bg-cotto-deep"
      >
        Send me a code
      </Button>

      <p className="text-center text-sm text-inchiostro-soft">
        New here? Just enter your email — we'll set up your account.
      </p>
    </form>
  )
}
