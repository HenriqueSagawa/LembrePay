import { prisma } from "../config/prisma.js"

export class SubscriptionRepository {
  async create(data: any) {
    return prisma.subscription.create({ data })
  }

  async findByUser(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId, isActive: true },
        orderBy: { nextBillingDate: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.subscription.count({
        where: { userId, isActive: true },
      }),
    ])

    return {
      data: subscriptions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  async findById(id: string) {
    return prisma.subscription.findUnique({
      where: { id },
    })
  }

  async update(id: string, data: any) {
    return prisma.subscription.update({
      where: { id },
      data,
    })
  }
}