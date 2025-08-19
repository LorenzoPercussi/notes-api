# NOTES API - README

API REST de bloco de notas feita em Node.js + TypeScript, usando Express, Prisma e PostgreSQL.

---

## TECNOLOGIAS

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL (via Docker)
- JWT (autenticação)
- Bcrypt (hash de senha)
- Zod (validação)

---

## ESTRUTURA DO PROJETO (pasta src/)

app.ts -> instancia do Express, middlewares e montagem das rotas
server.ts -> inicia o servidor (app.listen)
config/env.ts -> valida e exporta variáveis de ambiente
db/prisma.ts -> PrismaClient (singleton)
http/routes/_-> rotas (health, auth, notes)
http/controllers/_ -> lógica das rotas
http/middlewares/_-> middlewares (auth.guard, validate, error.handler)
utils/_ -> utilitários (hashing, jwt)

---

## COMO RODAR LOCALMENTE

1. Instalar dependências
   npm install

2. Subir PostgreSQL com Docker (uma única linha)
   WINDOWS/POWERSHELL:
   docker run -d --name notes-postgres -e POSTGRES_USER=notes -e POSTGRES_PASSWORD=notes -e POSTGRES_DB=notes -p 5432:5432 -v notes-pg-data:/var/lib/postgresql/data postgres:16

   LINUX/MAC:
   docker run -d --name notes-postgres -e POSTGRES_USER=notes -e POSTGRES_PASSWORD=notes -e POSTGRES_DB=notes -p 5432:5432 -v notes-pg-data:/var/lib/postgresql/data postgres:16

3. Criar o arquivo .env na raiz do projeto com:
   DATABASE_URL=
   JWT_SECRET=
   PORT=3000
   NODE_ENV=

4. Rodar migrações e gerar client do Prisma
   npx prisma migrate dev --name init
   npx prisma generate

5. Rodar a API (modo desenvolvimento)
   npm run dev

API disponível em: <http://localhost:3000>

---

## ROTAS PRINCIPAIS

Health

- GET /health -> status do servidor

Auth

- POST /auth/register -> cria usuário (name, email, password)
- POST /auth/login -> autentica e retorna accessToken (JWT)

Notes (todas exigem Authorization: Bearer token)

- POST /notes
- GET /notes (suporta page, pageSize, q, tag)
- GET /notes/:id
- PUT /notes/:id
- DELETE /notes/:id

---

## DICAS E PROBLEMAS COMUNS

- PowerShell: NÃO use contrabarra para quebrar linhas; prefira uma única linha nos comandos.
- Erro de conexão ao DB: verifique se o container está rodando (docker ps) e a porta (5432).
- Após mudar o schema.prisma: rode novamente "npx prisma migrate dev" e "npx prisma generate".
- O JWT deve ter expiração curta (ex.: 15m) e NUNCA colocar dados sensíveis no payload.

---

## PRÓXIMOS PASSOS

- Testes (unitários e integração)
- Documentação OpenAPI/Swagger
- Dockerfile e Docker Compose para a aplicação
- Deploy (Railway / Render / Fly.io)
- CI/CD (GitHub Actions)
