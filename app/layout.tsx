import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartInitializer } from "@/components/cart/cart-initializer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouteTransition } from "@/components/layout/route-transition";
import { MotionConfig } from "framer-motion";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Fieldstone — Materials, Made to Last",
    template: "%s | Fieldstone",
  },
  description:
    "Fieldstone makes considered goods from honestly sourced natural materials — built to be used, not just owned.",
  openGraph: {
    type: "website",
    siteName: "Fieldstone",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {/* Respects prefers-reduced-motion globally for every Framer Motion animation on the site */}
          <MotionConfig reducedMotion="user">
            <CartInitializer />
            <SiteHeader />
            <main id="main-content">
              <RouteTransition>{children}</RouteTransition>
            </main>
            <SiteFooter />
            <CartDrawer />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
