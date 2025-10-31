const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "uma_chave_secreta_supersegura";

// Login de usuário
exports.login = async (req, res) => {
  const { matricula, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const [rows] = await pool.query(
      `SELECT u.*, a00_nome AS tipo_nome
      FROM tb01_usuario u
      JOIN tb00_tipo_usuario t ON u.a01_tipo_usuario_id = t.a00_id
      WHERE u.a01_matricula = ? AND t.a000_ind_ativo = 1`,
      [matricula]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Matrícula ou senha inválida.' });

    const user = rows[0];

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, user.a01_senha_hash);

    if (!senhaCorreta)
      return res.status(401).json({ message: 'Matrícula ou senha inválida.' });

    // Gera token JWT
    const token = jwt.sign(
      {
        id: user.a01_id,
        tipo: user.tipo_nome,
        nome: user.a01_nome,
      },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    // Retorna o token e informações do usuário
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      usuario: { id: user.a01_id, nome: user.a01_nome, tipo: user.tipo_nome }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
