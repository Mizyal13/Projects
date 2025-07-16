// src/layouts/UserLayout.tsx
import { Outlet } from "react-router-dom";
import NavbarUser from "@/components/ui/NavbarUser";

export default function UserLayout() {
  return (
    <>
      <NavbarUser />
      <main className="min-h-screen p-4">
        <Outlet />
      </main>
    </>
  );
}
