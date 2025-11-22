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

// Buscar ocorrência por ID
router.get("/:id", ocorrenciasController.getOcorrenciaById);



module.exports = router;
