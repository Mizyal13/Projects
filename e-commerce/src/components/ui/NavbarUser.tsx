import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./button";

export default function NavbarUser() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white">
      <div className="text-xl font-bold text-purple-700">
        <Link to="/">MizyalApp</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link to="/products">
          <Button variant="ghost">Produk</Button>
        </Link>
        <Link to="/cart">
          <Button variant="ghost">Keranjang</Button>
        </Link>
        <Link to="/orders">
          <Button variant="ghost">Pesananku</Button>
        </Link>
        <Link to="/transfer-point">
          <Button variant="ghost">Transfer Poin</Button>
        </Link>
        <div className="mr-2">
          <Link to="/profile">
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

        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-xl">
          🪙 Poin: {user?.points ?? 0}
        </span>

        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    </nav>
  );
}
