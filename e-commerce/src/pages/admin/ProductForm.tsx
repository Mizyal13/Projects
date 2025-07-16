import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/services/ProductService";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

type Props = {
  mode: "create" | "edit";
};

export default function ProductForm({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && id) {
      getProductById(id).then((product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setPreview(`http://localhost:4000/uploads/${product.image}`);
      });
    }
  }, [mode, id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("stock", String(stock));
    if (image) formData.append("image", image);
    Swal.fire({
      title: mode === "create" ? "Menyimpan produk..." : "Mengupdate produk...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      if (mode == "create") {
        await createProduct(formData);
        Swal.fire({
          icon: "success",
          title: "Produk berhasil ditambahkan!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (id) {
        await updateProduct(id, formData);
        Swal.fire({
          icon: "success",
          title: "Produk berhasil diperbarui!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("gagal submit", err);
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: "Pastikan semua data sudah benar.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === "create" ? "Tambah Produk Baru" : "Edit Produk"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Nama Produk</Label>
          <Input
            id="name"
            type="text"
            placeholder="Masukkan nama produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Input
            id="description"
            type="text"
            placeholder="Tulis deskripsi produk"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input
            id="price"
            type="number"
            placeholder="Masukkan harga produk"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stok Produk</Label>
          <Input
            id="stock"
            type="number"
            placeholder="Jumlah stok tersedia"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Gambar Produk</Label>
          <Input id="image" type="file" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover mt-2 rounded"
            />
          )}
        </div>

        <Button type="submit" className="w-full">
          {mode === "create" ? "Tambah Produk" : "Update Produk"}
        </Button>
      </form>
    </div>
  );
}
