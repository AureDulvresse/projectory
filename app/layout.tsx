import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { auth } from "@/auth"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Projectory - Gestion de projets simplifiée",
  description: "Une plateforme moderne pour gérer vos projets efficacement",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider session={session}>
            {children}
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
