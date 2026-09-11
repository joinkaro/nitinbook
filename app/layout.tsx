import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ShopProvider } from "@/components/shop-provider";
import { FloatingWhatsApp } from "@/components/store-chrome";

export const metadata: Metadata = {
  title: "Nitin Sports | Cricket, Football & Teamwear",
  description: "Premium cricket and football equipment, protection, accessories and custom teamwear delivered across India.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="antialiased"><ShopProvider>{children}<FloatingWhatsApp/><Toaster position="top-center" richColors/></ShopProvider></body>
    </html>
  );
}
