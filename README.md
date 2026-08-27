# ☕ Coffee Journal

Um diário digital para registrar e acompanhar suas experiências com café especial. Desenvolvido para ajudar baristas e entusiastas de café a documentarem seus preparos e evolução.

## ✨ Funcionalidades

- 📝 Registro de cafés especiais com informações detalhadas
- 🎯 Acompanhamento de preparos com métricas precisas
- 📊 Avaliação de características sensoriais
- 📱 Interface responsiva e moderna
- 🌓 Suporte a tema claro/escuro
- 🔍 Histórico de preparos por café

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - React Hook Form
  - Zod

- **Backend:**
  - PostgreSQL (Neon.tech)
  - Drizzle ORM
  - Server Actions

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/0xchrisoliveira/coffee-journal.git
cd coffee-journal
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas credenciais do banco de dados.

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Estrutura do Projeto

```
coffee-journal/
├── app/                    # Rotas e páginas da aplicação
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── public/               # Arquivos estáticos
└── hooks/                # Hooks personalizados
```

## 🔧 Configuração do Banco de Dados

O projeto utiliza o Neon.tech como provedor de banco de dados PostgreSQL. As tabelas são criadas automaticamente na primeira execução através da rota `/api/setup`.

## 📱 Screenshots

[Adicione screenshots da aplicação aqui]

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Chris Oliveira

---

Feito com ❤️ e ☕

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
