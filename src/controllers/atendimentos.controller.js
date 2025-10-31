const pool = require("../config/db")


// Socorrista aceita ocorrência (status → em_andamento)
async function aceitarOcorrencia(req, res) {
  try {
    const { id } = req.params;
    const socorristaId = req.user.id;

    await pool.query(
      "UPDATE tb02_ocorrencia SET a02_status = 'em_andamento' WHERE a02_id = ?",
      [id]
    );

    await pool.query(
      "INSERT INTO tb04_atribuicao (a04_ocorrencia_id, a04_socorrista_id, a04_status) VALUES (?, ?, 'em_atendimento')",
      [id, socorristaId]
    );

    res.json({ msg: "Ocorrência aceita e em andamento.", ocorrenciaId: id });
  } catch (err) {
    console.error("Erro ao aceitar ocorrência:", err);
    res.status(500).json({ message: "Erro ao aceitar ocorrência." });
  }
}

// Socorrista finaliza ocorrência
async function finalizarOcorrencia(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE tb02_ocorrencia SET a02_status = 'finalizada' WHERE a02_id = ?",
      [id]
    );

    await pool.query(
      "UPDATE tb04_atribuicao SET a04_status = 'concluida' WHERE a04_ocorrencia_id = ?",
      [id]
    );

    res.json({ msg: "Ocorrência finalizada com sucesso.", ocorrenciaId: id });
  } catch (err) {
    console.error("Erro ao finalizar ocorrência:", err);
    res.status(500).json({ message: "Erro ao finalizar ocorrência." });
  }
}

// Socorrista repassa ocorrência para outro socorrista
async function repassarOcorrencia(req, res) {
  try {
    const { id } = req.params; // id da ocorrência
    const { socorristaId } = req.body;

    await pool.query(
      "INSERT INTO tb04_atribuicao (a04_ocorrencia_id, a04_socorrista_id, a04_status) VALUES (?, ?, 'pendente')",
      [id, socorristaId]
    );

    res.json({ msg: "Ocorrência repassada para socorrista.", ocorrenciaId: id });
  } catch (err) {
    console.error("Erro ao repassar ocorrência:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  aceitarOcorrencia,
  finalizarOcorrencia,
  repassarOcorrencia,
};
