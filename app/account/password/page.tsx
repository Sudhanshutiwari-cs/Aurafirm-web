import type { Metadata } from "next"
import ChangePasswordPageClient from "./ChangePasswordPageClient"

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update the password for your AURAFIRM account.",
  alternates: { canonical: "/account/password" },
  robots: { index: false, follow: false },
}

export default function ChangePasswordPage() {
  return <ChangePasswordPageClient />
}
