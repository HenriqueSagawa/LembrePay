# LembrePay - Backend ⚙️

O backend do **LembrePay** é uma API RESTful desenvolvida com **Node.js** e **TypeScript**, focada em fornecer um serviço seguro e eficiente para o gerenciamento de lembretes de pagamentos.

## 🌟 Funcionalidades

*   **Gestão de Usuários**: Autenticação segura utilizando JWT (JSON Web Tokens) e criptografia de senhas com bcrypt.
*   **Gerenciamento de Assinaturas**: CRUD completo para assinaturas e pagamentos recorrentes.
*   **Automação de Notificações**: Sistema de agendamento de tarefas (Cron Jobs) que verifica pagamentos próximos e envia e-mails automáticos aos usuários.
*   **Validação de Dados**: Uso da biblioteca Zod para garantir que as requisições sigam o formato esperado.

---

## 🛠️ Stack Tecnológica

*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Framework:** [Express](https://expressjs.com/)
*   **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Agendamento:** [Node-cron](https://www.npmjs.com/package/node-cron)
*   **Envio de E-mail:** [Nodemailer](https://nodemailer.com/)

---

## 🚀 Como Iniciar

### Pré-requisitos
*   Node.js (v18+)
*   Instância do PostgreSQL

### Instalação
1.  Entre no diretório: `cd backend`
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o arquivo `.env` na raiz do diretório `/backend`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/lembrepay"
    JWT_SECRET="sua_chave_secreta"
    SMTP_HOST="smtp.exemplo.com"
    SMTP_PORT="587"
    SMTP_USER="seu_email@exemplo.com"
    SMTP_PASS="sua_senha"
    ```
4.  Execute as migrações do banco de dados:
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```
5.  Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## 🐳 Rodando com Docker (API + Postgres + SMTP fake)

Na raiz do repositório (`/LembrePay`), execute:

```bash
docker compose up --build
```

- A API sobe em `http://localhost:3000`
- O Postgres fica em `localhost:5432` (db: `lembrepay`, user/pass: `postgres`)
- O MailHog (captura de e-mails) fica em `http://localhost:8025` e o SMTP em `localhost:1025`

---

## 📂 Estrutura de Pastas

*   `src/server.ts`: Ponto de entrada da aplicação.
*   `src/jobs/`: Lógica de agendamento de e-mails.
*   `prisma/`: Schema do banco de dados e migrações.
*   `src/routes/`: Definição dos endpoints da API.
