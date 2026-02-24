import { SubscriptionRepository } from "../repositories/subscription.repository.js";
import { calculateNextBillingDate } from "../utils/date.utils.js";

const repository = new SubscriptionRepository();

export class SubscriptionService {
  async create(userId: string, data: any) {
    const nextBillingDate = calculateNextBillingDate(
      new Date(data.startDate),
      data.billingCycle,
      data.customIntervalDays,
    );

    return repository.create({
      ...data,
      userId,
      nextBillingDate,  
      startDate: new Date(data.startDate)
    });
  }

  async list(userId: string) {
    return repository.findByUser(userId);
  }

  async desactive(userId: string, id: string) {
    const subscription = await repository.findById(id);

    if (!subscription || subscription.userId !== userId) {
      throw new Error("Subscription not found");
    }

    return repository.update(id, { isActive: false });
  }
}
