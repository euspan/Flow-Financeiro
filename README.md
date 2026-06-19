# 🌱 Flow Financeiro

Plataforma web gamificada de educação financeira.

## Estrutura do Projeto

```
flow-financeiro/
├── backend/          ← Node.js + Express + MongoDB
│   ├── src/
│   │   ├── models/   ← Estrutura dos dados (MongoDB)
│   │   ├── routes/   ← Rotas da API
│   │   ├── middleware/
│   │   └── server.js ← Ponto de entrada
│   ├── .env          ← Variáveis de ambiente
│   └── package.json
│
├── frontend/         ← React.js
│   ├── src/
│   │   ├── pages/    ← Telas da aplicação
│   │   ├── components/
│   │   ├── context/  ← Estado global (autenticação)
│   │   └── App.js    ← Rotas do React
│   └── package.json
```

## Tecnologias
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express, JWT
- **Banco de dados**: MongoDB Atlas
- **Design**: CSS inline com Nunito + Fredoka One

## Instalação e Execução

### 1. Instale as dependências
Primeiro, instale as dependências do backend e do frontend:

```bash
# Instale dependências do backend
cd backend
npm install

# Instale dependências do frontend
cd ../frontend
npm install
```

### 2. Configure as variáveis de ambiente
O arquivo `.env` já está configurado no backend com a URL do MongoDB Atlas, porta do servidor e secret do JWT.

### 3. Execute a aplicação

#### Backend
```bash
cd backend
npm start
```
O backend vai rodar em http://localhost:5000

#### Frontend
Abra um novo terminal e execute:
```bash
cd frontend
npm start
```
O frontend vai abrir automaticamente no navegador em http://localhost:3000

