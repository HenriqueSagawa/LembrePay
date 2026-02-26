import { app } from "./app.js"
import { startSubscriptionReminderJob } from "./jobs/subscriptionReminder.job.js"

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[Server] Variável de ambiente obrigatória não definida: ${envVar}`)
    process.exit(1)
  }
}

startSubscriptionReminderJob()

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`[Server] Servidor rodando na porta ${PORT}`)
})