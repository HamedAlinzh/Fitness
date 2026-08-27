import type { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ViewPixel from "@/components/analytics/ViewPixel";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Public pages only — the admin panel has its own layout and is never counted. */}
      <ViewPixel />
    </>
  );
}
