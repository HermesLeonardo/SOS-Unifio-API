const express = require("express");
const router = express.Router();
const { autenticar, autorizar } = require("../middleware/auth.middleware");
const { criarUsuario, listarUsuarios, deletarUsuario } = require("../controllers/usuarios.controller");

router.use(authMiddleware);

// Apenas admin pode mexer nos usuários
router.post("/", usuariosController.criarUsuario);
router.get("/", usuariosController.listarUsuarios);
router.delete("/:id", usuariosController.deletarUsuario);

module.exports = router;
