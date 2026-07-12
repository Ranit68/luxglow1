import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Profile");

export default function ProfileLayout({ children }) {
  return children;
}
