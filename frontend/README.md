# LembrePay - Frontend 📱

O frontend do **LembrePay** é um aplicativo móvel moderno e intuitivo, desenvolvido com **React Native** e **Expo**. Ele oferece uma interface limpa para que os usuários possam gerenciar suas assinaturas e visualizar seus compromissos financeiros de forma rápida.

## 🎨 Design e Estilização

O aplicativo utiliza **Tailwind CSS** (via NativeWind) para a estilização, garantindo um design responsivo, consistente e de fácil manutenção. A interface foi pensada para ser direta, focando na facilidade de adicionar e monitorar pagamentos recorrentes.

---

## 🛠️ Tecnologias Utilizadas

*   **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (NativeWind)
*   **Navegação:** [Expo Router](https://docs.expo.dev/router/introduction/) (Baseado em arquivos)
*   **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
*   **Consumo de API:** [Axios](https://axios-http.com/)

---

## 🚀 Como Executar

### Pré-requisitos
*   Node.js instalado
*   Aplicativo **Expo Go** instalado no seu celular (ou um emulador configurado)

### Passo a Passo
1.  Entre no diretório: `cd frontend`
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o arquivo `.env` (se necessário) com o endereço IP da sua API:
    ```env
    EXPO_PUBLIC_API_URL=http://seu-url-do-backend
    ```
4.  Inicie o projeto:
    ```bash
    npx expo start
    ```
5.  Escaneie o QR Code com o aplicativo Expo Go ou pressione `a` para Android ou `i` para iOS.

---

## 📂 Organização do Projeto

*   `app/`: Estrutura de rotas e telas do aplicativo.
*   `components/`: Componentes reutilizáveis (botões, inputs, cards).
*   `services/`: Configuração do Axios e chamadas para a API.
*   `stores/`: Gerenciamento de estado global com Zustand.
*   `assets/`: Imagens, ícones e fontes locais.
