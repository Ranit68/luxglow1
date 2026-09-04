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
    title: "Luxe&Glow - Premium Sarees Online India",
    description:
      "Shop premium sarees online in India at Luxe&Glow, including silk, Mashru, Mashru Banarasi, Banarasi, Bengali style, fancy, festive, and party wear sarees.",
    path: "/",
    keywords: [
      "premium sarees online",
      "silk sarees online india",
      "mashru banarasi saree",
      "banarasi sarees online",
      "bengali style saree",
      "party wear sarees online",
      "designer saree website india",
      "luxe and glow sarees",
    ],
  }),
  title: {
    default: "Luxe&Glow - Premium Sarees Online India",
    template: "%s | Luxe&Glow",
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
