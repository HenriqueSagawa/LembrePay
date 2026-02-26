import { z } from "zod"

export const createSubscriptionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido. Use o formato: 29.90"),
  currency: z.string().default("BRL"),
  billingCycle: z.enum(["MONTHLY", "YEARLY", "CUSTOM"]),
  customIntervalDays: z.number().int().positive().optional(),
  startDate: z.string(),
  reminderDaysBefore: z.number().int().positive().default(3)
}).refine(
  (data) => data.billingCycle !== "CUSTOM" || data.customIntervalDays !== undefined,
  {
    message: "customIntervalDays é obrigatório quando billingCycle é CUSTOM",
    path: ["customIntervalDays"],
  }
)