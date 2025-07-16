import { useEffect, useState } from "react";
import { getAllProducts } from "@/services/ProductService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

type ProductType = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, limit, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(page, limit, sort);
      console.log("📦 Produk dari API:", res);
      setProducts(res.products);
    } catch (error) {
      console.error("❌ Gagal fetch product:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Sort:</label>
          <Select
            value={sort}
            onValueChange={(val) => setSort(val as "asc" | "desc")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Harga Terendah</SelectItem>
              <SelectItem value="desc">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>

          <label className="text-sm font-medium ml-4">Limit:</label>
          <Select
            value={limit.toString()}
            onValueChange={(val) => setLimit(parseInt(val))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Card key={product.id}>
                <img
                  src={`http://localhost:4000/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <CardContent className="py-4 px-4 space-y-2">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-purple-700 font-bold">
                    Rp {product.price.toLocaleString()}
                  </p>{" "}
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-full">Produk tidak ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}
