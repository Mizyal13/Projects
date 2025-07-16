import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "@/services/ProductService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import Swal from "sweetalert2";

type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    console.log("ID dari URL:", id);
    if (!id) return;

    console.log("Mulai ambil data produk...");

    setLoading(true);
    getProductById(id)
      .then((data) => {
        console.log("✅ Data produk:", data);
        setProduct(data);
      })
      .catch((err) => console.error("Gagal ambil produk:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product)
    return <p className="text-center mt-10">Produk tidak ditemukan</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <Card className="grid md:grid-cols-2 gap-6 p-6">
        <img
          src={`http://localhost:4000/uploads/${product.image}`}
          alt={product.name}
          className="w-full h-72 object-cover rounded-xl"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-purple-700 font-semibold text-xl">
            Rp {product.price.toLocaleString()}
          </p>
          <p className="text-gray-700">
            Stok tersedia: {product.stock ?? 0} item
          </p>
          <p className="text-gray-700">
            {product.description ?? "Tidak ada deskripsi."}
          </p>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              if (product) {
                addToCart(product);
                Swal.fire({
                  title: "Berhasil!",
                  text: `"${product.name}" ditambahkan ke keranjang.`,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }}
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </Card>
    </div>
  );
}
