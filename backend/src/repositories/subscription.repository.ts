import { prisma } from "../config/prisma.js";

export class SubscriptionRepository {
  async create(data: any) {
    return prisma.subscription.create({ data });
  }

  async findByUser(userId: string) {
    return prisma.subscription.findMany({
      where: { userId, isActive: true },
    });
  }

  async findById(id: string) {
    return prisma.subscription.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return prisma.subscription.update({
        where: { id },
        data
    })
  }
}
