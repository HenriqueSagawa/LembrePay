import cron from "node-cron"
import { prisma } from "../config/prisma.js"
import dayjs from "dayjs"
import { sendEmail } from "../services/email.service.js"
import { advanceNextBillingDate } from "../utils/date.utils.js"

export function startSubscriptionReminderJob() {
  cron.schedule("8 10 * * *", async () => {
    console.log("[CronJob] Iniciando verificação de assinaturas...")

    const subscriptions = await prisma.subscription.findMany({
      where: { isActive: true },
      include: { user: true },
    })

    const today = dayjs().startOf("day")

    for (const subscription of subscriptions) {
      try {
        const nextPayment = dayjs(subscription.nextBillingDate).startOf("day")
        const diffInDays = nextPayment.diff(today, "day")

        if (diffInDays < 0) {
          const billingCycle = subscription.billingCycle as "MONTHLY" | "YEARLY" | "CUSTOM"
          const newNextBillingDate = advanceNextBillingDate(
            subscription.nextBillingDate,
            billingCycle,
            subscription.customIntervalDays ?? undefined,
          )

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { nextBillingDate: newNextBillingDate },
          })

          console.log(
            `[CronJob] nextBillingDate atualizado para "${subscription.name}" (${subscription.user.email})`
          )
          continue
        }

        if (diffInDays > subscription.reminderDaysBefore) {
          continue
        }

        const alreadySentToday = await prisma.notificationLog.findFirst({
          where: {
            subscriptionId: subscription.id,
            type: "EMAIL",
            sentAt: {
              gte: today.toDate(),
              lt: today.add(1, "day").toDate(),
            },
          },
        })

        if (alreadySentToday) {
          console.log(
            `[CronJob] Email já enviado hoje para "${subscription.name}" (${subscription.user.email}), pulando.`
          )
          continue
        }

        await sendEmail(
          subscription.user.email,
          "Sua assinatura está próxima do vencimento",
          `
            <h2>Olá, ${subscription.user.name} 👋</h2>
            <p>A assinatura <strong>${subscription.name}</strong> vence em <strong>${diffInDays === 0 ? "hoje" : `${diffInDays} dia(s)`}</strong>.</p>
            <p>Valor: ${subscription.currency} ${subscription.price}</p>
            <br/>
            <p>Equipe LembrePay 🚀</p>
          `,
        )

        await prisma.notificationLog.create({
          data: {
            type: "EMAIL",
            status: "SENT",
            userId: subscription.userId,
            subscriptionId: subscription.id,
          },
        })

        console.log(
          `[CronJob] Email enviado para "${subscription.name}" (${subscription.user.email})`
        )
      } catch (err) {
        console.error(
          `[CronJob] Falha ao processar assinatura ${subscription.id}:`,
          err
        )

        const errorMessage = err instanceof Error ? err.message : String(err)

        await prisma.notificationLog.create({
          data: {
            type: "EMAIL",
            status: "FAILED",
            errorMessage,
            userId: subscription.userId,
            subscriptionId: subscription.id,
          },
        }).catch((logErr: any) =>
          console.error("[CronJob] Falha ao salvar log de erro:", logErr)
        )
      }
    }

    console.log("[CronJob] Verificação concluída.")
  })
}