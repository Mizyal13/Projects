import { prisma } from "../connection/client";

export async function getAdminSummary() {
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();

  const totalPointsTransferred = await prisma.pointHistory.aggregate({
    _sum: {
      points: true,
    },
  });

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalPointsTransferred: totalPointsTransferred._sum.points || 0,
  };
}
