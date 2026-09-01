import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}
