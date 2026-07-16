import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

import { CartProvider } from "../../components/CartContext";
import { AppShell } from "../../components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aristino | Premium Menswear",
  description: "Experience classic Italian tailoring and premium menswear collections.",
  keywords: "premium menswear, tailored shirts, Pima cotton polo, Italian style menswear, luxury shirts",
  icons: {
    icon: "/images/aristino-logo.svg",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-offwhite text-brand-charcoal font-sans">
        <CartProvider>
          <AppShell>
            {children}
          </AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
