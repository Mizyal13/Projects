import { useEffect, useState } from "react";
import {
  getAllProductsAdmin,
  softDeleteProduct,
  hardDeleteProduct,
  restoreProduct,
} from "@/services/ProductService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
  description: string;
  isDeleted: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductsAdmin(page, 5, sort);
      setProducts(data.products);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: number) => {
    try {
      await softDeleteProduct(id);
      Swal.fire({
        title: "Menghapus...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      await softDeleteProduct(id);
      Swal.fire({
        icon: "success",
        title: "Produk berhasil dihapus sementara",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchProducts();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal soft delete",
        text: "Terjadi kesalahan saat menghapus produk",
      });
      console.error("Gagal soft delete:", err);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct(id);
      Swal.fire({
        title: "Mengembalikan produk...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      await restoreProduct(id);
      Swal.fire({
        icon: "success",
        title: "Produk berhasil dipulihkan!",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchProducts();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal restore",
        text: "Terjadi kesalahan saat restore produk",
      });
      console.error("Gagal restore:", err);
    }
  };

  const handleHardDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Permanen?",
      text: "Data produk akan hilang selamanya!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    try {
      Swal.fire({
        title: "Menghapus permanen...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      await hardDeleteProduct(id);
      Swal.fire({
        icon: "success",
        title: "Produk berhasil dihapus permanen",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchProducts();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal hard delete",
        text: "Produk masih terhubung ke data lain (misalnya pesanan)",
      });
      console.error("Gagal hard delete:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort]);

  return (
    <div>
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <Button onClick={() => navigate("/admin/products/create")}>
            + Tambah Produk
          </Button>
        </div>

        <div className="flex gap-4 mb-4">
          <Button variant="outline" onClick={() => setSort("asc")}>
            Sort: A-Z
          </Button>
          <Button variant="outline" onClick={() => setSort("desc")}>
            Sort: Z-A
          </Button>
        </div>

        {loading ? (
          <p>Memuat produk...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4 relative">
                {product.isDeleted && (
                  <div className="absolute top-2 right-2 text-red-500 text-xs">
                    Dihapus
                  </div>
                )}
                <img
                  src={`http://localhost:4000/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {product.description}
                </p>
                <p className="text-sm text-gray-600">
                  Stok: <span className="font-semibold">{product.stock}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Rp {product.price.toLocaleString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/products/edit/${product.id}`)
                    }
                  >
                    Edit
                  </Button>
                  {!product.isDeleted ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleSoftDelete(product.id)}
                    >
                      Soft Delete
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleRestore(product.id)}
                      >
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleHardDelete(product.id)}
                      >
                        Hard Delete
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
