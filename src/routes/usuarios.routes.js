const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");
const usuariosController = require("../controllers/usuarios.controller");

// Todas as rotas abaixo exigem autenticação
router.use(authMiddleware);

// Criar usuário (somente administrador)
router.post("/", authorizeRoles("administrador"), usuariosController.criarUsuario);

// Listar usuários
router.get("/", authorizeRoles("administrador"), usuariosController.listarUsuarios);

// Desativar usuário
router.delete("/:id", authorizeRoles("administrador"), usuariosController.deletarUsuario);

module.exports = router;
