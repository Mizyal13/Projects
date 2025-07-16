import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { changePassword } from "@/services/authService";
import Swal from "sweetalert2";

export default function Profile() {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Swal.fire("Oops", "Semua kolom harus diisi", "warning");
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      Swal.fire("Berhasil", "Password berhasil diubah", "success");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Gagal ubah password",
        "error"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">Profil Saya</h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={`http://localhost:4000/uploads/${
            user?.profile || "default.jpg"
          }`}
          alt="Foto Profil"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div className="text-center">
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
            {user?.role === "admin" ? "Admin" : "Pelanggan"}
          </span>
        </div>
      </div>

      <div className="border-t pt-5">
        <h3 className="text-lg font-semibold text-center mb-4">Keamanan</h3>

        {!showPasswordForm ? (
          <div className="text-center">
            <Button onClick={() => setShowPasswordForm(true)}>
              Ganti Password
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Password lama"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOldPassword("");
                  setNewPassword("");
                  setShowPasswordForm(false);
                }}
              >
                Batal
              </Button>
              <Button onClick={handleChangePassword}>Simpan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
