import { prisma } from "../connection/client";

export async function transferPoints(
  senderId: number,
  recipientEmail: string,
  amount: number
) {
  if (amount <= 0) throw new Error("Jumlah poin tidak valid");

  const recipient = await prisma.user.findUnique({
    where: { email: recipientEmail },
  });
  if (!recipient) throw new Error("Penerima tidak ditemukan");

  return await prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUnique({ where: { id: senderId } });
    if (!sender) throw new Error("Pengirim tidak ditemukan");

    if (sender.points < amount) throw new Error("Poin tidak cukup");

    await tx.user.update({
      where: { id: senderId },
      data: {
        points: {
          decrement: amount,
        },
      },
    });

    await tx.user.update({
      where: { id: recipient.id },
      data: {
        points: {
          increment: amount,
        },
      },
    });

    await tx.pointHistory.create({
      data: {
        userId: senderId,
        points: -amount,
        reason: `Transfer ke ${recipient.email}`,
      },
    });

    await tx.pointHistory.create({
      data: {
        userId: recipient.id,
        points: amount,
        reason: `Menerima dari ${sender.email}`,
      },
    });

    return {
      from: sender.email,
      to: recipient.email,
      amount,
    };
  });
}
