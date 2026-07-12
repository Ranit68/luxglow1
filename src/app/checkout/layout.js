import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Checkout");

export default function CheckoutLayout({ children }) {
  return children;
}
