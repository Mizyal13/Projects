// src/layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import NavbarAdmin from "@/components/ui/NavbarAdmin";

export default function AdminLayout() {
  return (
    <>
      <NavbarAdmin />
      <main className="min-h-screen p-4">
        <Outlet />
      </main>
    </>
  );
}
