import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import limiter from "./middlewares/rate-limiter";
import { corsMiddleware } from "./middlewares/cors";
import users from "./routes/user";
import products from "./routes/product";
import orders from "./routes/order";
import points from "./routes/point";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(limiter);
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/user", users);
app.use("/product", products);
app.use("/order", orders);
app.use("/point", points);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`server telah berjalan di ${PORT}`);
});
