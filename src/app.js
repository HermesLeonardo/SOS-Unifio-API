const express = require('express');
const bodyParser = require('body-parser');

const usuarioRoutes = require('./routes/usuarios.routes');
const ocorrenciaRoutes = require('./routes/ocorrencias.routes');
const triagemRoutes = require('./routes/triagens.routes');

const app = express();
app.use(bodyParser.json());

// Rotas principais
app.use('/usuarios', usuarioRoutes);
app.use('/ocorrencias', ocorrenciaRoutes);
app.use('/triagens', triagemRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚑 Servidor rodando na porta ${PORT}`);
});
