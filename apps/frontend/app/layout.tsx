import type { Metadata } from "next"
import { Inter } from "next/font/google"
// __HEADING_FONT_IMPORT__
import { Providers } from "./providers"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})
// __HEADING_FONT_DECLARATION__

export const metadata: Metadata = {
  title: "__PROJECT_NAME__",
  description: "__PROJECT_NAME__",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} __HEADING_FONT_CLASS__ h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
