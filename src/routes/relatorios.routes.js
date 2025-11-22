const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, authorizeRoles(4), (req, res) => {
  res.json({ msg: "Relatórios gerados pelo administrador." });
});

module.exports = router;
