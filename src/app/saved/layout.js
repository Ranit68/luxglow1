import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Saved Products");

export default function SavedLayout({ children }) {
  return children;
}
