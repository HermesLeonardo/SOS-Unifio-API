const pool = require("../config/db")
const bcrypt = require('bcrypt');

// Criar usuário (somente administrador)
async function criarUsuario(req, res) {

  try {
    if (req.user.tipo !== "administrador") {
      return res.status(403).json({ message: "Acesso negado. Somente administradores podem criar usuários." });
    }

    const { nome, email, senha, tipo, matricula } = req.body;

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    await pool.query(
      "INSERT INTO tb01_usuario (a01_nome, a01_email, a01_senha_hash, a01_tipo_usuario_id, a01_matricula) VALUES (?, ?, ?, ?, ?)",
      [nome, email, senhaHash, tipo, matricula]
    );

    res.status(201).json({ msg: "Usuário criado com sucesso." });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({ message: "Erro interno ao criar usuário." });
  }
}

// Listar usuários (somente administrador)
async function listarUsuarios(req, res) {
  try {
    if (req.user.tipo !== "administrador") {
      return res.status(403).json({ message: "Acesso negado. Somente administradores podem visualizar usuários." });
    }

    const [rows] = await pool.query(
      "SELECT a01_id, a01_nome, a01_email, a01_tipo_usuario, a01_matricula FROM tb01_usuario WHERE a000_ind_ativo = 1"
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ message: "Erro interno ao listar usuários." });
  }
}

// Deletar usuário (somente administrador)
async function deletarUsuario(req, res) {
  try {
    if (req.user.tipo !== "administrador") {
      return res.status(403).json({ message: "Acesso negado. Somente administradores podem deletar usuários." });
    }

    const { id } = req.params;

    // Inativar em vez de excluir (boa prática)
    await pool.query("UPDATE tb01_usuario SET a000_ind_ativo = 0 WHERE a01_id = ?", [id]);

    res.json({ msg: "Usuário desativado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ message: "Erro interno ao deletar usuário." });
  }
}

module.exports = { criarUsuario, listarUsuarios, deletarUsuario };

