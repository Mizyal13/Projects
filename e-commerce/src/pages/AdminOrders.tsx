import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/adminOrderService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AdminOrder = {
  id: number;
  createdAt: string;
  totalPrice: number;
  user: {
    name: string;
  };
  orderItems: {
    qty: number;
    price: number;
    product: {
      name: string;
      price: number;
      image?: string;
    };
  }[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getAllOrders(page, limit, sort)
      .then((res) => {
        setOrders(res.orders);
        setTotal(res.total);
      })
      .catch((err) => console.error("Gagal ambil pesanan admin:", err))
      .finally(() => setLoading(false));
  }, [page, limit, sort]);

  const totalPages = Math.ceil(total / limit);

  if (loading)
    return <p className="text-center mt-10">Memuat semua pesanan...</p>;
  if (orders.length === 0)
    return <p className="text-center mt-10">Belum ada pesanan masuk.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setSort("asc")}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            Sort: ASC
          </button>
          <button
            onClick={() => setSort("desc")}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            Sort: DESC
          </button>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="text-sm px-2 py-1 border rounded"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>

      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold text-lg">
              Pesanan oleh: {order.user.name}
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          {order.orderItems.map((item) => (
            <div
              key={item.product.name}
              className="flex items-center justify-between border-t py-2"
            >
              <div className="flex items-center gap-4">
                {item.product.image ? (
                  <img
                    src={`http://localhost:4000/uploads/${item.product.image}`}
                    className="w-16 h-16 object-cover rounded"
                    alt={item.product.name}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Harga: Rp {item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">Qty: {item.qty}</Badge>
                <p className="text-purple-700 font-bold">
                  Rp {(item.qty * item.product.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}

          <div className="text-right mt-4 font-bold text-lg text-green-700">
            Total Pesanan: Rp {order.totalPrice.toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
}
