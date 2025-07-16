import { prisma } from "../connection/client";

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}) {
  return await prisma.product.create({ data });
}

export async function getAllProducts({
  search,
  sort,
  page = 1,
  limit = 10,
  includeDeleted = false,
}: {
  search?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}) {
  const where = {
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
    ...(includeDeleted ? {} : { deletedAt: null }),
  };

  const orderBy: { [key: string]: "asc" | "desc" } =
    sort === "asc" || sort === "desc" ? { price: sort } : { createdAD: "desc" };

  const products = await prisma.product.findMany({
    where: {
      ...where,
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.product.count({
    where: {
      ...where,
    },
  });

  const transformed = products.map((p) => ({
    ...p,
    isDeleted: !!p.deletedAt,
  }));

  return { products: transformed, total };
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
  }
) {
  const { name, description, price, stock, image } = data;

  return await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      image: image || undefined,
    },
  });
}

export async function softDeleteProduct(id: number) {
  await prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreProduct(id: number) {
  await prisma.product.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

export const getProductDetail = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) throw new Error("product tidak ditemukan");
  return product;
};

export async function deleteProductHard(id: number) {
  return await prisma.product.delete({
    where: { id },
  });
}
