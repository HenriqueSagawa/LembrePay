export function calculateNextBillingDate(
  startDate: Date,
  billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM",
  customIntervalDays?: number,
): Date {
  if (billingCycle === "CUSTOM" && !customIntervalDays) {
    throw new Error("customIntervalDays é obrigatório para ciclo CUSTOM")
  }

  const now = new Date()
  let nextDate = new Date(startDate)

  while (nextDate <= now) {
    switch (billingCycle) {
      case "MONTHLY":
        nextDate.setMonth(nextDate.getMonth() + 1)
        break

      case "YEARLY":
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break

      case "CUSTOM":
        nextDate.setDate(nextDate.getDate() + customIntervalDays!)
        break
    }
  }

  return nextDate
}

export function advanceNextBillingDate(
  currentNextBillingDate: Date,
  billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM",
  customIntervalDays?: number,
): Date {
  if (billingCycle === "CUSTOM" && !customIntervalDays) {
    throw new Error("customIntervalDays é obrigatório para ciclo CUSTOM")
  }

  const nextDate = new Date(currentNextBillingDate)

  switch (billingCycle) {
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1)
      break

    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1)
      break

    case "CUSTOM":
      nextDate.setDate(nextDate.getDate() + customIntervalDays!)
      break
  }

  return nextDate
}