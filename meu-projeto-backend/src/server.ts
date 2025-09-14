import express from 'express';
import 'dotenv/config';
import  router  from './routes/index.js';

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Usar o prefixo /api para todas as rotas
app.use('/api', router);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});