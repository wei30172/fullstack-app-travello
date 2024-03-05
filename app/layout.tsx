import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Montserrat } from "next/font/google"
import './globals.css'

import { siteConfig } from '@/config/site'
import { QueryProvider } from '@/providers/query-provider'
import ThemeProvider from '@/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ModalProvider } from '@/providers/modal-provider'
import AuthProvider from '@/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })
export const textFont = Montserrat({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/logo.png",
      href: "/logo.png"
    }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              >
              <Toaster />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
