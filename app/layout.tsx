import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/oracle/auth";
import { AuthPage } from "@/components/oracle/AuthPage";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Silent Oracle — Numerology & Astrology",
  description: "Silent Oracle is a unified numerology and astrology app. Decode any person, company, country, or sports event, consult the Oracle AI for personalised guidance, and explore daily energy, compatibility, and an entity database of 1,000+ famous people and brands.",
  keywords: ["Silent Oracle", "numerology", "astrology", "Life Path", "Chinese zodiac", "Western zodiac", "compatibility", "oracle", "divination"],
  authors: [{ name: "Silent Oracle" }],
  icons: { icon: "/icon.svg" },
  openGraph: { title: "Silent Oracle — Numerology & Astrology", description: "Decode any entity with numerology + Chinese zodiac, then consult the Oracle AI for personalised guidance.", url: "https://chat.z.ai", siteName: "Silent Oracle", type: "website" },
  twitter: { card: "summary_large_image", title: "Silent Oracle — Numerology & Astrology", description: "Decode any entity with numerology + Chinese zodiac, then consult the Oracle AI for personalised guidance." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}>
        <AuthProvider>
          {children}
          <AuthPage />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
