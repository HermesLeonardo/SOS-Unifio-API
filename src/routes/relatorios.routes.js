const express = require("express");
const { autenticar, autorizar } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", autenticar, autorizar(4), (req, res) => {
  res.json({ msg: "Relatórios gerados pelo administrador." });
});

module.exports = router;
