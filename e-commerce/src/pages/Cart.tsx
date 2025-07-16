import { useCart } from "@/hooks/useCart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkoutCart } from "@/services/CartService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";

toast.success("checkout berhasil");
export default function Cart() {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const { cart, removeFromCart, plusQty, minQty, setCart } = useCart();

  const grandTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0)
    return <p className="text-center mt-10">Keranjang kosong</p>;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Keranjang Kosong",
        text: "Tambahkan produk ke keranjang terlebih dahulu!",
      });
    }
    try {
      await checkoutCart(cart);
      await fetchUser();
      setCart([]);
      await Swal.fire({
        icon: "success",
        title: "Checkout Berhasil!",
        text: "Pesanan kamu telah diproses.",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Lihat Pesanan",
      });
      navigate("/Orders");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Checkout Gagal",
        text: "Terjadi kesalahan saat memproses pesanan.",
      });
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      {cart.map((item) => (
        <Card key={item.id} className="grid grid-cols-6 items-center gap-4 p-4">
          <img
            src={`http://localhost:4000/uploads/${item.image}`}
            alt={item.name}
            className="w-16 h-16 object-cover rounded col-span-1"
          />

          <div className="col-span-2">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">
              Harga: Rp {item.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <Button onClick={() => minQty(item.id)} size="sm">
              -
            </Button>
            <span>{item.quantity}</span>
            <Button onClick={() => plusQty(item.id)} size="sm">
              +
            </Button>
          </div>

          <div className="flex flex-col items-end col-span-1 text-right">
            <p className="text-purple-700 font-semibold">
              Rp {(item.price * item.quantity).toLocaleString()}
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                Swal.fire({
                  title: `Hapus ${item.name}?`,
                  text: "Produk akan dihapus dari keranjang.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#ef4444",
                  cancelButtonColor: "#9ca3af",
                  confirmButtonText: "Ya, hapus!",
                  cancelButtonText: "Batal",
                }).then((result) => {
                  if (result.isConfirmed) {
                    removeFromCart(item.id);
                    Swal.fire({
                      icon: "success",
                      title: "Dihapus!",
                      text: `${item.name} telah dihapus dari keranjang.`,
                      timer: 1200,
                      showConfirmButton: false,
                    });
                  }
                });
              }}
            >
              Hapus
            </Button>
          </div>
        </Card>
      ))}

      <div className="text-right font-bold text-xl pr-4">
        Total: Rp {grandTotal.toLocaleString()}
      </div>
      <div className="text-right pr-4 mt-4">
        <Button onClick={handleCheckout}>Checkout</Button>
      </div>
    </div>
  );
}
