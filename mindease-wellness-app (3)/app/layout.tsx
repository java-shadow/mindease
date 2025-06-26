import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindEase - Mental Wellness Companion",
  description: "Your anonymous AI-powered mental wellness companion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <AuthProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
