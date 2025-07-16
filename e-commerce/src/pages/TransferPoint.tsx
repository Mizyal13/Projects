import { useEffect, useState } from "react";
import { transferPoint, getPointHistory } from "@/services/pointService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";

type PointLog = {
  id: number;
  points: number;
  reason: string;
  createdAt: string;
};
export default function TransferPoint() {
  const { user, loading, fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState<PointLog[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await getPointHistory();
      setHistory(res);
    } catch (err) {
      console.error(" Gagal ambil history poin:", err);
    }
  };
  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Memuat data pengguna...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Tidak valid",
        text: "masa tranfer ke diri sendiri sih hmmm!",
      });
      return;
    }

    if (amount > (user?.points ?? 0)) {
      Swal.fire({
        icon: "error",
        title: "Poin tidak cukup",
        text: "Jumlah poin melebihi poin yang kamu miliki!",
      });
      return;
    }
    Swal.fire({
      title: "Proses transfer...",
      timer: 1000,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await transferPoint(email, amount);
      await fetchUser();
      await fetchHistory();
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Poin berhasil ditransfer ke ${email}`,
          timer: 2000,
          showConfirmButton: false,
        });
      }, 1000);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Transfer",
        text: err.response?.data?.message || "Terjadi kesalahan saat transfer.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-sm space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4">Transfer Point</h2>
        <p className="text-sm mb-4 text-gray-500">
          Poin kamu: {user?.points ?? 0}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Email tujuan"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Jumlah poin"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={1}
            required
          />
          <Button type="submit" className="w-full">
            Kirim
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Riwayat Poin</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada riwayat.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded border ${
                  item.points > 0 ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="text-sm">
                  {item.reason}{" "}
                  <span
                    className={
                      item.points > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {item.points > 0 ? "+" : ""}
                    {item.points} poin
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
