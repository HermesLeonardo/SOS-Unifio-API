const pool = require("../config/db");

// Dashboard geral do sistema
async function getDashboard(req, res) {
  try {

    // Usuários
    const [[usuarios]] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN a000_ind_ativo = 1 THEN 1 ELSE 0 END) AS ativos,
        SUM(CASE WHEN a000_ind_ativo = 0 THEN 1 ELSE 0 END) AS inativos
      FROM tb01_usuario
    `);

    // Ocorrências totais e do mês
    const [[ocorrencias]] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(
          CASE 
            WHEN MONTH(a02_data_abertura) = MONTH(CURRENT_DATE())
             AND YEAR(a02_data_abertura) = YEAR(CURRENT_DATE())
            THEN 1 ELSE 0 
          END
        ) AS do_mes
      FROM tb02_ocorrencia
    `);

    // Situação das ocorrências
    const [[status]] = await pool.query(`
      SELECT
        SUM(CASE WHEN a02_situacao_ocorrencia_id = 1 THEN 1 ELSE 0 END) AS abertas,
        SUM(CASE WHEN a02_situacao_ocorrencia_id = 2 THEN 1 ELSE 0 END) AS triagem,
        SUM(CASE WHEN a02_situacao_ocorrencia_id = 3 THEN 1 ELSE 0 END) AS em_andamento,
        SUM(CASE WHEN a02_situacao_ocorrencia_id = 4 THEN 1 ELSE 0 END) AS finalizadas,
        SUM(CASE WHEN a02_situacao_ocorrencia_id = 5 THEN 1 ELSE 0 END) AS canceladas,

        SUM(CASE WHEN a02_prioridade = 'alta' THEN 1 ELSE 0 END) AS emergencias,
        SUM(CASE WHEN a02_prioridade = 'media' THEN 1 ELSE 0 END) AS urgencias
      FROM tb02_ocorrencia
    `);

    // Socorristas ativos
    const [[socorristas]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM tb01_usuario
      WHERE a01_tipo_usuario_id = (
        SELECT a00_id FROM tb00_tipo_usuario WHERE a00_nome = 'socorrista'
      )
      AND a000_ind_ativo = 1
    `);

    // Tempo médio de resposta
    const [[tempo]] = await pool.query(`
      SELECT 
        AVG(TIMESTAMPDIFF(MINUTE, a02_data_abertura, a02_data_finalizacao)) AS minutos
      FROM tb02_ocorrencia
      WHERE a02_data_finalizacao IS NOT NULL
    `);

    // Ocorrências recentes
    const [recentes] = await pool.query(`
      SELECT 
        o.a02_id,
        u.a01_nome AS usuario_nome,
        l.a02l_nome AS local_nome,
        o.a02_prioridade,
        o.a02_classificacao_ocorrencia AS classificacao,
        t.a02t_nome AS tipo_ocorrencia,
        s.a02s_nome AS situacao,
        o.a02_descricao AS a02_descricao,
        o.a02_data_abertura
      FROM tb02_ocorrencia o
      JOIN tb01_usuario u ON u.a01_id = o.a02_usuario_id
      JOIN tb02_local_ocorrencia l ON l.a02l_id = o.a02_local_ocorrencia_id
      JOIN tb02_situacao_ocorrencia s ON s.a02s_id = o.a02_situacao_ocorrencia_id
      JOIN tb02_tipo_ocorrencia t ON t.a02t_id = o.a02_tipo_ocorrencia_id
      ORDER BY o.a02_data_abertura DESC
      LIMIT 10
    `);

    res.json({
      usuarios: {
        total: usuarios.total,
        ativos: usuarios.ativos,
        inativos: usuarios.inativos
      },

      ocorrencias: {
        total: ocorrencias.total,
        do_mes: ocorrencias.do_mes
      },

      status: {
        abertas: status.abertas,
        em_triagem: status.triagem,
        em_andamento: status.em_andamento,
        finalizadas: status.finalizadas,
        canceladas: status.canceladas,

        emergencias: status.emergencias,
        urgencias: status.urgencias
      },

      socorristas: {
        ativos: socorristas.total
      },

      tempoResposta: {
        media_minutos: tempo.minutos || 0
      },

      recentes: recentes,

      uptime: 99.8
    });

  } catch (err) {
    console.error("Erro no dashboard:", err);
    res.status(500).json({ message: "Erro ao carregar dashboard." });
  }
}

async function getHistorico(req, res) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(`
      SELECT 
        o.a02_id,
        o.a02_prioridade,
        o.a02_classificacao_ocorrencia AS classificacao,
        t.a02t_nome AS tipo_ocorrencia,
        s.a02s_nome AS situacao,
        o.a02_descricao AS descricao,
        o.a02_data_abertura,
        o.a02_data_finalizacao,
        u.a01_nome AS usuario_nome,
        u.a01_email AS usuario_email,
        l.a02l_nome AS local_nome
      FROM tb02_ocorrencia o
      JOIN tb01_usuario u ON u.a01_id = o.a02_usuario_id
      JOIN tb02_local_ocorrencia l ON l.a02l_id = o.a02_local_ocorrencia_id
      JOIN tb02_situacao_ocorrencia s ON s.a02s_id = o.a02_situacao_ocorrencia_id
      JOIN tb02_tipo_ocorrencia t ON t.a02t_id = o.a02_tipo_ocorrencia_id
      LEFT JOIN tb04_atribuicao a ON a.a04_ocorrencia_id = o.a02_id
      WHERE o.a02_situacao_ocorrencia_id = 4
      ORDER BY o.a02_data_abertura DESC;
    `);

    res.json(rows);

  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    res.status(500).json({ message: "Erro ao carregar histórico." });
  }
}

module.exports = {
  getDashboard,
  getHistorico
};
