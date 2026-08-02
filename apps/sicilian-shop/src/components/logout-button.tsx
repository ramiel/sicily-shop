"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { authClient } from "@/lib/better-auth-client"

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      fullWidth
      isPending={isPending}
      onPress={() => {
        startTransition(async () => {
          await authClient.signOut().catch(() => {})
          await fetch("/api/auth/session", { method: "DELETE" })
          router.push("/")
          router.refresh()
        })
      }}
    >
      Log out
    </Button>
  )
}
