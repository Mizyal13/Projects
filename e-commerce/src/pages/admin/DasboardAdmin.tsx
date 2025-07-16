import { getAdminSummary } from "@/services/AdminService";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<{
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalPointsTransferred: number;
  } | null>(null);

  useEffect(() => {
    getAdminSummary().then(setSummary).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {!summary ? (
        <p>Memuat data ringkasan...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="text-gray-500 text-sm">Total Produk</h3>
            <p className="text-2xl font-bold">{summary.totalProducts}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500 text-sm">Total User</h3>
            <p className="text-2xl font-bold">{summary.totalUsers}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500 text-sm">Total Pesanan</h3>
            <p className="text-2xl font-bold">{summary.totalOrders}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500 text-sm">Total Point Transfer</h3>
            <p className="text-2xl font-bold">
              {summary.totalPointsTransferred}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
