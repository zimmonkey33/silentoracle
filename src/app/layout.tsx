import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Silent Oracle — GG33 Numerology & Astrology",
  description:
    "A unified GG33 numerology and astrology app. Decode any person, company, country, or sports event with strict GG33 methodology, consult the Silent Oracle AI for personalised guidance, and explore daily energy, compatibility, and an entity database of 1,400+ famous people and brands.",
  keywords: [
    "GG33",
    "numerology",
    "astrology",
    "Silent Oracle",
    "Life Path",
    "Chinese zodiac",
    "Western zodiac",
    "compatibility",
    "oracle",
    "divination",
  ],
  authors: [{ name: "Silent Oracle" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Silent Oracle — GG33 Numerology & Astrology",
    description:
      "Decode any entity with strict GG33 numerology + Chinese zodiac, then consult the Silent Oracle AI for personalised guidance.",
    url: "https://chat.z.ai",
    siteName: "Silent Oracle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Oracle — GG33 Numerology & Astrology",
    description:
      "Decode any entity with strict GG33 numerology + Chinese zodiac, then consult the Silent Oracle AI for personalised guidance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
