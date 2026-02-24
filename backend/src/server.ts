import { app } from "./app.js";
import { startSubscriptionReminderJob } from "./jobs/subscriptionReminder.job.js";

startSubscriptionReminderJob();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
