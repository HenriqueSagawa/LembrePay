import { SubscriptionRepository } from "../repositories/subscription.repository.js"
import { calculateNextBillingDate } from "../utils/date.utils.js"

const repository = new SubscriptionRepository()

export class SubscriptionService {
  async create(userId: string, data: any) {
    const nextBillingDate = calculateNextBillingDate(
      new Date(data.startDate),
      data.billingCycle,
      data.customIntervalDays,
    )

    return repository.create({
      ...data,
      userId,
      nextBillingDate,
      startDate: new Date(data.startDate),
      price: data.price,
    })
  }

  async list(userId: string, page = 1, pageSize = 20) {
    return repository.findByUser(userId, page, pageSize)
  }

  async desactive(userId: string, id: string) {
    const subscription = await repository.findById(id)

    if (!subscription || subscription.userId !== userId) {
      throw new Error("Assinatura não encontrada")
    }

    return repository.update(id, { isActive: false })
  }
}