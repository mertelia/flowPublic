import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/layout/hero/nav/Nav";
import Footer from "@/components/ui/layout/footer/footer";
import localFont from "next/font/local";
import Hero from "@/components/ui/layout/hero/header/Header";

export const suisseMono = localFont({
  src: "../assets/fonts/Suisse-Intl-Mono.ttf",
  variable: "--font-suisse-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Flow",
  description: "Stage Productions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${caveat.variable} ${suisseMono.className} font-sans antialiased overflow-x-hidden bg-black `}
      >
        <Nav />
        <Hero />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
