# LembrePay 💰

O **LembrePay** é uma solução completa para o gerenciamento de assinaturas e lembretes de pagamentos. O projeto foi desenvolvido para ajudar usuários a manterem suas contas em dia, oferecendo uma interface intuitiva para cadastro de despesas recorrentes e um sistema automatizado de notificações por e-mail.

O ecossistema do projeto é dividido em duas frentes principais:
1.  **Backend**: Uma API robusta construída com Node.js e TypeScript, responsável pela lógica de negócio, autenticação e agendamento de tarefas.
2.  **Frontend**: Um aplicativo móvel moderno desenvolvido com Expo e React Native, focado na experiência do usuário e facilidade de uso.

---

## 🚀 Tecnologias Principais

O projeto utiliza uma stack moderna e tipada para garantir segurança e escalabilidade:

| Camada | Tecnologias |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Frontend** | Expo, React Native, TypeScript, NativeWind (Tailwind CSS) |
| **Infraestrutura** | Node-cron (Agendamento), Nodemailer (E-mails), JWT (Autenticação) |

---

## 📂 Estrutura do Repositório

O repositório está organizado de forma clara para facilitar o desenvolvimento e a manutenção:

*   `/backend`: Contém toda a lógica do servidor, modelos de banco de dados e serviços de notificação.
*   `/frontend`: Contém o código-fonte do aplicativo móvel, incluindo telas, componentes e integração com a API.

---

## 🛠️ Como Executar o Projeto

Para rodar o LembrePay localmente, você precisará ter instalado o Node.js e o gerenciador de pacotes (npm ou yarn).

### 1. Clonar o Repositório
```bash
git clone https://github.com/HenriqueSagawa/LembrePay.git
cd LembrePay
```

### 2. Configurar o Backend
Acesse a pasta do backend, instale as dependências e configure as variáveis de ambiente (conforme detalhado no README do backend).
```bash
cd backend
npm install
# Siga as instruções no /backend/README.md
```

### 3. Configurar o Frontend
Acesse a pasta do frontend, instale as dependências e inicie o Expo.
```bash
cd ../frontend
npm install
npx expo start
```

---

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo de licença para mais detalhes.

---
Desenvolvido por [Henrique Sagawa](https://github.com/HenriqueSagawa).
