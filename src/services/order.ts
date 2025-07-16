import { prisma } from "../connection/client";

export async function createOrder(
  userId: number,
  items: { productId: number; qty: number }[]
) {
  let total = 0;

  const orderItemsData = await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product)
        throw new Error(`Produk ID ${item.productId} tidak ditemukan`);
      const subTotal = product.price * item.qty;
      total += subTotal;

      return {
        productId: item.productId,
        qty: item.qty,
        price: product.price,
      };
    })
  );

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice: total,
      orderItems: {
        create: orderItemsData,
      },
    },
    include: { orderItems: true },
  });
  await updateUserPoints(userId, total);
  return order;
}

export async function updateUserPoints(userId: number, totalPrice: number) {
  const POINT_CONVERSION = Number(process.env.POINT_CONVERSION) || 1000;
  const earnedPoints = Math.floor(totalPrice / POINT_CONVERSION);

  await prisma.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: earnedPoints,
      },
    },
  });
  await prisma.pointHistory.create({
    data: {
      userId,
      points: earnedPoints,
      reason: `Poin dari checkout`,
    },
  });
}

export async function getAllOrders({
  userId,
  sort,
  page = 1,
  limit = 10,
}: {
  userId?: number;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const where: any = {
    userId: userId || undefined,
  };
  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
    },
    orderBy: {
      createdAt: sort || "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.order.count({
    where,
  });

  return {
    total,
    page,
    limit,
    orders,
  };
}

export async function getOrdersByUserId(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: {
            select: { name: true, price: true, image: true },
          },
        },
      },
    },
  });

  return orders;
}

export async function getUserOrders(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}
