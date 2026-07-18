import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export function MarketingLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
