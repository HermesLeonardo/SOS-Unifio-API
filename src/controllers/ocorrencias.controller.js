const pool = require("../db");
const { generateProtocol } = require('../helpers/generateProtocol');

// Aluno abre ocorrência
async function abrirOcorrencia(req, res) {
  const { localizacao, descricao } = req.body;
  const usuarioId = req.user.id;

  try {
    const protocolo = generateProtocol('EMG');
    const [result] = await pool.query(
      "INSERT INTO tb02_ocorrencia (a02_usuario_id, a02_localizacao, a02_descricao) VALUES (?, ?, ?)",
      [usuarioId, localizacao, descricao]
    );

    res.status(201).json({ msg: "Ocorrência aberta com sucesso!", id: result.insertId, protocolo});
  } catch (err) {
    console.error('Erro ao criar ocorrência:', error);
    res.status(500).json({ message: 'Erro interno ao criar ocorrência.' });
  }
}

// Listar as ocorrências do aluno
async function listarOcorrenciasAluno(req, res) {
  try {
    const usuarioId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM tb02_ocorrencia WHERE a02_usuario_id = ?",
      [usuarioId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Socorrista lista todas as ocorrências em aberto
async function listarOcorrenciasAbertas(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tb02_ocorrencia WHERE a02_status = 'aberta'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



//Listar todas as ocorrências (data de abertura)
async function listarTodasOcorrencias(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM tb02_ocorrencia ORDER BY a02_data_abertura DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar ocorrências:', error);
    res.status(500).json({ message: 'Erro ao buscar ocorrências.' });
  }
}


module.exports = {
  abrirOcorrencia,
  listarOcorrenciasAluno,
  listarOcorrenciasAbertas,
  listarTodasOcorrencias,
};
