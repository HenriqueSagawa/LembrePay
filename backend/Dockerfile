FROM node:20-bookworm-slim

WORKDIR /app

# Necessário para o `prisma generate` durante o build (não precisa apontar para um DB real)
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lembrepay"

# Instala dependências primeiro (melhor cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Gera Prisma Client + compila TS + copia client gerado para dist/
RUN npm run build

# Porta padrão da API
EXPOSE 3000

# Em runtime: aplica migrations e sobe a API
CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/server.js"]


