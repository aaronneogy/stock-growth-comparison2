import type { Metadata } from "next"
import "./globals.css"
import { inter } from "./fonts"

export const metadata: Metadata = {
  title: "Stock Growth Comparison",
  description: "Compare stock growth and build portfolios",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
