import { z } from "zod"

export const createSubscriptionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number(),
  currency: z.string().default("BRL"),
  billingCycle: z.enum(["MONTHLY", "YEARLY", "CUSTOM"]),
  customIntervalDays: z.number().optional(),
  startDate: z.string(),
  reminderDaysBefore: z.number().default(3)
})