
/* ==========================================
   NERD ANGOLA PLANET
   API REST - Gerenciamento de Produtos
========================================== */

// Importação das dependências
const express = require('express');
const db = require('./db');
const cors = require('cors');

// Importa as funções auxiliares do módulo de validações
const {
  validarId,
  validarProduto,
  prepararProduto
} = require('./utils/validacoes');

// Inicialização da aplicação Express
const app = express();

// Permite requisições do Angular local e do site publicado
const origensPermitidas = [
  'http://localhost:4200',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: origensPermitidas
}));

// Permite receber dados em formato JSON
app.use(express.json());


/* ==========================================
   ROTA INICIAL
========================================== */

// Confirma que a API está funcionando
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Nerd Angola Planet funcionando!'
  });
});


/* ==========================================
   GET - LISTAR TODOS OS PRODUTOS
========================================== */

app.get('/api/produtos', async (req, res) => {
  try {
    // Consulta todos os produtos cadastrados
    const [produtos] = await db.query(
      'SELECT * FROM produtos'
    );

    res.json(produtos);

  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar produtos'
    });
  }
});


/* ==========================================
   GET - CONSULTAR PRODUTO POR ID
========================================== */

app.get('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Impede consultas com identificadores inválidos
  if (!validarId(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido'
    });
  }

  try {
    // Consulta parametrizada para evitar
    // a inserção direta de valores no SQL
    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    res.json(produtos[0]);

  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar produto'
    });
  }
});


/* ==========================================
   POST - CADASTRAR PRODUTO
========================================== */

app.post('/api/produtos', async (req, res) => {
  // Reutiliza a validação centralizada
  if (!validarProduto(req.body)) {
    return res.status(400).json({
      mensagem: 'Dados do produto inválidos'
    });
  }

  try {
    // Prepara os dados para inserção no MySQL
    const dados = prepararProduto(req.body);

    const [resultado] = await db.query(
      `INSERT INTO produtos
       (nome, categoria, imagem, descricao, preco, estoque)
       VALUES (?, ?, ?, ?, ?, ?)`,
      dados
    );

    // Retorna o produto recém-cadastrado
    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [resultado.insertId]
    );

    res.status(201).json(produtos[0]);

  } catch (erro) {
    console.error('Erro ao cadastrar produto:', erro);

    res.status(500).json({
      mensagem: 'Erro ao cadastrar produto'
    });
  }
});


/* ==========================================
   PUT - ATUALIZAR PRODUTO
========================================== */

app.put('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Verifica se o identificador é válido
  if (!validarId(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido'
    });
  }

  // Reutiliza a mesma validação do POST
  if (!validarProduto(req.body)) {
    return res.status(400).json({
      mensagem: 'Dados do produto inválidos'
    });
  }

  try {
    // Prepara os dados e acrescenta o ID
    const dados = [
      ...prepararProduto(req.body),
      id
    ];

    const [resultado] = await db.query(
      `UPDATE produtos
       SET nome = ?, categoria = ?, imagem = ?,
           descricao = ?, preco = ?, estoque = ?
       WHERE id = ?`,
      dados
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    // Retorna o produto atualizado
    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );

    res.json(produtos[0]);

  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);

    res.status(500).json({
      mensagem: 'Erro ao atualizar produto'
    });
  }
});


/* ==========================================
   DELETE - EXCLUIR PRODUTO
========================================== */

app.delete('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);

  // Valida o identificador
  if (!validarId(id)) {
    return res.status(400).json({
      mensagem: 'ID inválido'
    });
  }

  try {
    // Exclui o produto pelo identificador
    const [resultado] = await db.query(
      'DELETE FROM produtos WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    // Exclusão realizada com sucesso
    res.status(204).send();

  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);

    res.status(500).json({
      mensagem: 'Erro ao excluir produto'
    });
  }
});


/* ==========================================
   EXPORTAÇÃO DA APLICAÇÃO
========================================== */

// Permite utilizar o Express no servidor
// e nos testes automatizados com Supertest
module.exports = app;
