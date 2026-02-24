import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import dayjs from "dayjs";

import { sendEmail } from "../services/email.service.js";

export function startSubscriptionReminderJob() {
  cron.schedule("32 16 * * *", async () => {
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
        await sendEmail(
          subscription.user.email,
          "Sua assinatura está próxima do vencimento",
          `
      <h2>Olá, ${subscription.user.name} 👋</h2>
      <p>A assinatura <strong>${subscription.name}</strong> vence em <strong>${diffInDays} dias</strong>.</p>
      <p>Valor: R$ ${subscription.price}</p>
      <br/>
      <p>Equipe LembrePay 🚀</p>
    `,
        );
      }
    }
  });
}
