import { cp, mkdir, access } from "node:fs/promises";
import path from "node:path";

const from = path.resolve("src", "generated");
const to = path.resolve("dist", "generated");

async function main() {
  try {
    await access(from);
  } catch {
    // Se o prisma generate não criou nada, falha com mensagem clara
    throw new Error(
      `[build] Pasta não encontrada: ${from}. Rode "npm run prisma:generate" antes do build.`
    );
  }

  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true, force: true });
  console.log(`[build] Prisma Client copiado: ${from} -> ${to}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


