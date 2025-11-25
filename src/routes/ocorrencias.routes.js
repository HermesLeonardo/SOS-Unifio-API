const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");
const ocorrenciasController = require("../controllers/ocorrencias.controller");

router.use(authMiddleware);

// Aluno
router.post('/', authorizeRoles('aluno'), ocorrenciasController.abrirOcorrencia);

router.get('/minhas', authorizeRoles('aluno'), ocorrenciasController.listarOcorrenciasAluno);

// Socorrista
router.get('/abertas', authorizeRoles('socorrista'), ocorrenciasController.listarOcorrenciasAbertas);

// Brigadista e Admin
router.get('/', authorizeRoles('administrador'), ocorrenciasController.listarTodasOcorrencias);

// Locais disponiveis 
router.get("/locais", ocorrenciasController.listarLocais);

// Buscar ocorrências recentes
router.get("/recentes", ocorrenciasController.getOcorrenciasRecentes);

// Buscar resumo das ocorrências para os status do dashboard 
router.get("/resumoDash", ocorrenciasController.getOcorrenciasResumo);

// Listar ocorrências ativas para a tela de active-occurrences
router.get("/ativas", authMiddleware, ocorrenciasController.listarOcorrenciasAtivas);

// Buscar ocorrência por ID
router.get("/:id", ocorrenciasController.getOcorrenciaById);

// listar as ocorrencias de um socorrista
router.get("/socorrista/minhas", authMiddleware, ocorrenciasController.listarOcorrenciasSocorrista);



module.exports = router;
