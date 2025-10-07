const express = require("express");
const router = express.Router();
const { autenticar, autorizar } = require("../middleware/auth.middleware");
const ocorrenciasController = require("../controllers/ocorrencias.controller");

router.use(authMiddleware);

// Aluno
router.post("/", ocorrenciasController.abrirOcorrencia);
router.get("/minhas", ocorrenciasController.listarOcorrenciasAluno);

// Socorrista
router.get("/abertas", ocorrenciasController.listarOcorrenciasAbertas);

// Brigadista e Admin
router.get("/todas", ocorrenciasController.listarTodasOcorrencias);

module.exports = router;
