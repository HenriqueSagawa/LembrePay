export function calculateNextBillingDate(
  currentDate: Date,
  billingCycle: "MONTHLY" | "YEARLY" | "CUSTOM",
  customIntervalDays?: number,
) {
  const nextDate = new Date(currentDate);

  switch (billingCycle) {
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;

    case "CUSTOM":
      if (!customIntervalDays) {
        throw new Error("Custom interval days is required");
      }
      nextDate.setDate(nextDate.getDate() + customIntervalDays);
      break;
  }

  return nextDate;
}
