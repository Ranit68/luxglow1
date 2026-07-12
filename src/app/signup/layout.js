import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Sign Up");

export default function SignupLayout({ children }) {
  return children;
}
