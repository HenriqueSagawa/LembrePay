import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import dayjs from "dayjs";

export function startSubscriptionReminderJob() {
  cron.schedule("55 15 * * *", async () => {
    console.log("Executando tarefa de lembrete de assinatura...");

    const subscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    console.log("Assinaturas encontradas: ", subscriptions);

    const today = dayjs().startOf("day");

    for (const subscription of subscriptions) {
      const nextPayment = dayjs(subscription.nextBillingDate).startOf("day");

      const diffInDays = nextPayment.diff(today, "day");
      if (diffInDays <= subscription.reminderDaysBefore && diffInDays >= 0) {
        console.log(
          `Notificação ${subscription.user.email}:
       ${subscription.name} vence em ${diffInDays == 0} dias`,
        );
      }
    }
  });
}
