import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

import { Playfair_Display, Poppins } from "next/font/google";

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

export const metadata = {
  title: "LuxxGlow Sarees – Buy Designer Sarees Online in India",
  description:
    "Shop premium silk, cotton & designer sarees online in India. Wedding, party & daily wear sarees at best prices.",
  keywords:
    "buy saree online india, silk sarees online, wedding saree india, designer sarees",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <body className={`${playfair.variable} ${poppins.variable}`}>
  <AuthProvider>
  <CartProvider>
    <Navbar />
    {children}
    <Footer />
  </CartProvider>
  </AuthProvider>
</body>

    </html>
  );
}
