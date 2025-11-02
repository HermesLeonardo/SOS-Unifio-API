const pool = require("../config/db")
const { generateProtocol } = require('../helpers/generateProtocol');
const { getIO } = require("../config/socket");


// Aluno abre ocorrência
async function abrirOcorrencia(req, res) {
  try {
    const { 
      locationId, 
      peopleCount, 
      occurrenceType, 
      description, 
      locationDescription,
      prioridade 
    } = req.body;

    const usuarioId = req.user.id;

    console.log("Dados recebidos:", { 
      locationId, 
      peopleCount, 
      occurrenceType, 
      description, 
      locationDescription, 
      prioridade,
      usuarioId 
    });

    const situacaoInicialId = 1;
    const protocolo = generateProtocol("EMG");

    // prioridade default (fallback) se o front ainda não enviar
    const prioridadeFinal = prioridade || "indefinida";

    const [result] = await pool.query(
      `INSERT INTO tb02_ocorrencia
        (a02_usuario_id, a02_local_ocorrencia_id, a02_detalhe_local,
        a02_qtd_pessoas, a02_tipo_ocorrencia_id, a02_prioridade,
        a02_situacao_ocorrencia_id, a02_descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        locationId,
        locationDescription,
        peopleCount || 1,
        occurrenceType,
        prioridadeFinal,
        situacaoInicialId,
        description
      ]
    );

    // Nova ocorrência gerada
    const novaOcorrencia = {
      id: result.insertId,
      descricao: description,
      prioridade: prioridadeFinal,
      classificacao: "emergencia", // temporário até termos a lógica real
      usuario_nome: req.user?.nome || "Usuário",
      local_nome: locationDescription || "Local não informado",
      data_abertura: new Date(),
    };

    //  Envia o evento em tempo real para todos conectados
    getIO().emit("nova_ocorrencia", novaOcorrencia);
    console.log(" Evento 'nova_ocorrencia' emitido:", novaOcorrencia);

    return res.status(201).json({
      message: "Ocorrência aberta com sucesso!",
      id: result.insertId,
      protocolo
    });

  } catch (err) {
    console.error("Erro ao criar ocorrência:", err);
    res.status(500).json({ message: "Erro interno ao criar ocorrência." });
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

// Listar todas as ocorrências (data de abertura)
async function listarTodasOcorrencias(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM tb02_ocorrencia ORDER BY a02_data_abertura DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar ocorrências:', err);
    res.status(500).json({ message: 'Erro ao buscar ocorrências.' });
  }
}

async function listarLocais(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
         a02l_id AS id,
         a02l_nome AS name,
         a02l_descricao AS description
       FROM tb02_local_ocorrencia
       WHERE a000_ind_ativo = 1
       ORDER BY a02l_nome`
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao listar locais:", err);
    res.status(500).json({ message: "Erro interno ao listar locais." });
  }
}


  async function getOcorrenciaById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query(
        `SELECT 
          o.*,
          u.a01_nome AS usuario_nome,
          l.a02l_nome AS local_nome,
          s.a01_nome AS socorrista_nome
        FROM tb02_ocorrencia o
        JOIN tb01_usuario u ON u.a01_id = o.a02_usuario_id
        JOIN tb02_local_ocorrencia l ON l.a02l_id = o.a02_local_ocorrencia_id
        LEFT JOIN tb01_usuario s ON s.a01_id = o.a02_id
        WHERE o.a02_id = ?`,
        [id]
      );


      if (rows.length === 0)
        return res.status(404).json({ message: "Ocorrência não encontrada." });

      res.json(rows[0]);
    } catch (err) {
      console.error("Erro ao buscar ocorrência:", err);
      res.status(500).json({ message: "Erro interno ao buscar ocorrência." });
    }
  }


  async function getOcorrenciasRecentes(req, res) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          o.*,
          u.a01_nome AS usuario_nome,
          l.a02l_nome AS local_nome,
          s.a01_nome AS socorrista_nome
        FROM tb02_ocorrencia o
        JOIN tb01_usuario u ON u.a01_id = o.a02_usuario_id
        JOIN tb02_local_ocorrencia l ON l.a02l_id = o.a02_local_ocorrencia_id
        LEFT JOIN tb01_usuario s ON s.a01_id = o.a02_id
        ORDER BY o.a02_data_abertura DESC
        LIMIT 20`
      );

      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar ocorrências recentes:", err);
      res.status(500).json({ message: "Erro interno ao buscar ocorrências." });
    }
  }


  // Busca simplificada das ocorrências recentes (para dashboard)
  async function getOcorrenciasResumo(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          o.a02_id,
          o.a02_classificacao_ocorrencia AS classificacao,  -- urgência / emergência
          t.a02t_nome AS tipo_ocorrencia,                   -- Nome do tipo (ex: Lesões, Queimaduras etc)
          o.a02_prioridade,                                 -- Prioridade (vinda da nova coluna)
          s.a02s_nome AS situacao,                          -- Situação atual (ex: aberto, finalizado)
          u.a01_nome AS usuario_nome,                       -- Nome de quem abriu
          l.a02l_nome AS local_nome,                        -- Local (ex: Bloco A)
          o.a02_descricao,                                  -- Descrição da ocorrência
          o.a02_data_abertura                               -- Data/hora de abertura
        FROM tb02_ocorrencia o
        JOIN tb01_usuario u ON u.a01_id = o.a02_usuario_id
        JOIN tb02_local_ocorrencia l ON l.a02l_id = o.a02_local_ocorrencia_id
        JOIN tb02_situacao_ocorrencia s ON s.a02s_id = o.a02_situacao_ocorrencia_id
        JOIN tb02_tipo_ocorrencia t ON t.a02t_id = o.a02_tipo_ocorrencia_id
        WHERE o.a000_ind_ativo = b'1'
        ORDER BY o.a02_data_abertura DESC
        LIMIT 10;
      `);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Nenhuma ocorrência encontrada." });
      }

      res.json(rows);
    } catch (err) {
      console.error("Erro ao buscar resumo de ocorrências:", err);
      res.status(500).json({ message: "Erro interno ao buscar resumo de ocorrências." });
    }
  }


  module.exports = {
    abrirOcorrencia,
    listarOcorrenciasAluno,
    listarOcorrenciasAbertas,
    listarTodasOcorrencias,
    listarLocais,
    getOcorrenciaById,
    getOcorrenciasRecentes,
    getOcorrenciasResumo,
  };
