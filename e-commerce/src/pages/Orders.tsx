import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orderService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Order = {
  id: number;
  createdAt: string;
  totalPrice: number;
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((data) => {
        console.log("✅ Orders dari backend:", data);
        setOrders(data);
      })
      .catch((err) => {
        console.error("❌ Gagal ambil pesanan:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat pesanan...</p>;
  if (orders.length === 0)
    return <p className="text-center mt-10">Belum ada pesanan.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <h3 className="font-bold text-lg">
            Pesanan pada {new Date(order.createdAt).toLocaleString()}
          </h3>
          <p className="text-gray-600 mb-2">
            Total Harga:{" "}
            <span className="font-semibold text-purple-700">
              Rp {order.totalPrice.toLocaleString()}
            </span>
          </p>
          {order.orderItems.map((item) => (
            <div
              key={item.product.name}
              className="flex items-center justify-between border-t py-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`http://localhost:4000/uploads/${item.product.image}`}
                  className="w-16 h-16 object-cover rounded"
                  alt={item.product.name}
                />
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
                  Rp {(item.product.price * item.qty).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
