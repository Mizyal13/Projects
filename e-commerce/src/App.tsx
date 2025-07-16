import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import TransferPoint from "./pages/TransferPoint";
import AdminDashboard from "./pages/admin/DasboardAdmin";
import AdminProducts from "./pages/admin/ProductsAdmin";
import AdminRoute from "./routes/AdminRoute";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProductForm from "./pages/admin/ProductForm";
import Profile from "./pages/profile";
import ProfileAdmin from "./pages/admin/profileAdmin";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/transfer-point" element={<TransferPoint />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/profile" element={<ProfileAdmin />} />

          <Route
            path="/admin/products/create"
            element={<ProductForm mode="create" />}
          />
          <Route
            path="/admin/products/edit/:id"
            element={<ProductForm mode="edit" />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
