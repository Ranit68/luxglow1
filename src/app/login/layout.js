import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Login");

export default function LoginLayout({ children }) {
  return children;
}
