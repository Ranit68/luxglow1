"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DurgaPujoExperience from "@/components/DurgaPujoExperience";

export default function LayoutWrapper({ children }) {

  const pathname = usePathname();

  // pages where navbar should be hidden
  const hideNavbarRoutes = ["/login", "/signup"];

  const hideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      <DurgaPujoExperience />
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
