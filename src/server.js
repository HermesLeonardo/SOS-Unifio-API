const express = require("express");
const cors = require("cors");
const http = require("http");

const { initSocket } = require("./config/socket");

// Rotas
const authRoutes = require("./routes/auth.routes");
const ocorrenciasRoutes = require("./routes/ocorrencias.routes");
const triagensRoutes = require("./routes/triagens.routes");
const atendimentosRoutes = require("./routes/atendimentos.routes");
const relatoriosRoutes = require("./routes/relatorios.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initSocket(server); // inicializa o Socket.IO aqui

// Rotas
app.use("/auth", authRoutes);
app.use("/ocorrencias", ocorrenciasRoutes);
app.use("/triagens", triagensRoutes);
app.use("/atendimentos", atendimentosRoutes);
app.use("/relatorios", relatoriosRoutes);
app.use("/usuarios", usuariosRoutes);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
