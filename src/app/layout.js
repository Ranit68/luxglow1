import Footer from "../components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { SavedProductsProvider } from "@/context/SavedProductsContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { createMetadata, siteConfig } from "@/lib/seo";

import "./globals.css";

import { Cormorant_Garamond, Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-editorial",
});

export const metadata = {
  ...createMetadata({
    title: "Luxe&Glow Sarees",
    description:
      "Shop premium sarees online in India with bridal, silk, cotton, organza, festive, and party wear collections.",
    path: "/",
    keywords: [
      "luxe and glow sarees",
      "designer saree website india",
      "premium sarees online",
    ],
  }),
  title: {
    default: "Luxe&Glow Sarees",
    template: "%s | Luxe&Glow Sarees",
  },
  applicationName: siteConfig.name,
  category: "fashion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body className={`${playfair.variable} ${poppins.variable} ${cormorant.variable}`}>
        <AuthProvider>
          <SavedProductsProvider>
            <CartProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <Footer />
            </CartProvider>
          </SavedProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
