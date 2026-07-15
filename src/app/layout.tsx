import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NAGAS Resort — Luxury Escape in Paradise",
  description: "Experience unparalleled luxury at NAGAS Resort. Discover breathtaking sunsets, lush tropical gardens, world-class dining, and bespoke hospitality in paradise.",
  keywords: "NAGAS resort, luxury resort, tropical paradise, sunset resort, luxury villa, tropical escape",
  openGraph: {
    title: "NAGAS Resort — Luxury Escape in Paradise",
    description: "Experience unparalleled luxury at NAGAS Resort.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-sunset-cream`}>
        {children}
      </body>
    </html>
  );
}
