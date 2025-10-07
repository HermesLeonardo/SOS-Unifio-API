const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET;

// Login de usuário
exports.login = async (req, res) => {
  const { matricula, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const [rows] = await pool.query('SELECT * FROM tb01_usuario WHERE a01_matricula = ?', [matricula]);

    if (rows.length === 0)
      return res.status(401).json({ message: 'Matrícula ou senha inválida.' });

    const user = rows[0];

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, user.a01_senha_hash);

    if (!senhaCorreta)
      return res.status(401).json({ message: 'Matrícula ou senha inválida.' });

    // Gera token JWT
    const token = jwt.sign(
      { id: user.a01_id, tipo: user.a01_tipo_usuario, nome: user.a01_nome },
      secretKey,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Retorna o token e informações do usuário
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.a01_id,
        nome: user.a01_nome,
        tipo: user.a01_tipo_usuario
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};
