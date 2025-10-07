const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const ocorrenciasRoutes = require("./routes/ocorrencias.routes");
const triagensRoutes = require("./routes/triagens.routes");
const atendimentosRoutes = require("./routes/atendimentos.routes");
const relatoriosRoutes = require("./routes/relatorios.routes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//rotas
app.use("/auth", authRoutes);
app.use("/api/ocorrencias", ocorrenciasRoutes);
app.use("/api/triagens", triagensRoutes);
app.use("/api/atendimentos", atendimentosRoutes);
app.use("/api/relatorios", relatoriosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
