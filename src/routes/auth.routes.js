const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

// Login por matrícula e senha
router.post("/login", async (req, res) => {
  const { matricula, senha } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM tb01_usuario WHERE a01_matricula = ? AND a01_senha_hash = ? AND a000_ind_ativo = 1",
      [matricula, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Matrícula ou senha incorreta." });
    }

    const user = rows[0];
    const token = jwt.sign(
      {
        id: user.a01_id,
        tipo: user.a01_tipo_usuario,
        nome: user.a01_nome,
      },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login realizado com sucesso.",
      token,
      usuario: { id: user.a01_id, nome: user.a01_nome, tipo: user.a01_tipo_usuario },
    });
  } catch (err) {
    console.error("Erro ao realizar login:", err);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

module.exports = router;
