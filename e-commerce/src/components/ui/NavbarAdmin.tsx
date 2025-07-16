// src/components/ui/NavbarAdmin.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./button";

export default function NavbarAdmin() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-gray-100">
      <div className="text-xl font-bold text-red-700">
        <Link to="/admin/dashboard">Admin</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/admin/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/admin/products">
          <Button variant="ghost">Kelola Produk</Button>
        </Link>
        <Link to="/admin/orders">
          <Button variant="ghost">Semua Pesanan</Button>
        </Link>
        <div className="mr-2">
          <Link to="/admin/profile">
            <Button variant="outline">
              {" "}
              <img
                src={`http://localhost:4000/uploads/${
                  user?.profile || "default.jpg"
                }`}
                alt="Foto Profil"
                className="w-7 h-7 rounded-full object-cover border-2 "
              />
              {user && (
                <span className="text-sm text-gray-600 font-normal">
                  {user.name}
                </span>
              )}
            </Button>
          </Link>
        </div>

        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </nav>
  );
}
