const db = require('../config/db');

// Criar triagem
exports.createTriagem = async (req, res) => {
  const { ocorrencia_id, profissional_id, classificacao, observacoes } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tb03_triagem (a03_ocorrencia_id, a03_profissional_id, a03_classificacao, a03_observacoes) VALUES (?,?,?,?)",
      [ocorrencia_id, profissional_id, classificacao, observacoes]
    );
    res.status(201).json({ id: result.insertId, message: "Triagem registrada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar triagens
exports.getTriagens = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tb03_triagem");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
