const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const atendimentosController = require("../controllers/atendimentos.controller");

router.use(authMiddleware);

// Socorrista aceita ocorrência
router.put("/:id/aceitar", atendimentosController.aceitarOcorrencia);

// Socorrista finaliza ocorrência
router.put("/:id/finalizar", atendimentosController.finalizarOcorrencia);

// Socorrista repassa ocorrência
router.post("/:id/repassar", atendimentosController.repassarOcorrencia);

module.exports = router;
