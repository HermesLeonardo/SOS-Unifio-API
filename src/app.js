const express = require('express');
const bodyParser = require('body-parser');

const usuarioRoutes = require('./routes/usuarioRoutes');
const ocorrenciaRoutes = require('./routes/ocorrenciaRoutes');
const triagemRoutes = require('./routes/triagemRoutes');

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
