import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Cart");

export default function CartLayout({ children }) {
  return children;
}
