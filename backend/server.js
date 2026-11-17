
const express = require('express');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Permite receber dados em JSON
app.use(express.json());

// Rota inicial da API
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Nerd Angola Planet funcionando!'
  });
});



 // Retorna todos os produtos do MySQL
app.get('/api/produtos', async (req, res) => {
  try {
    const [produtos] = await db.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao buscar produtos'
    });
  }
});



app.get('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido'
    });
  }

  try {
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
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao buscar produto'
    });
  }
});



app.post('/api/produtos', async (req, res) => {
  const { nome, categoria, imagem, descricao, preco, estoque } = req.body;

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof categoria !== 'string' || !categoria.trim() ||
    typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0 ||
    !Number.isInteger(estoque) || estoque < 0
  ) {
    return res.status(400).json({
      mensagem: 'Nome, categoria, preço e estoque válidos são obrigatórios'
    });
  }

  try {
    const [resultado] = await db.query(
      `INSERT INTO produtos
       (nome, categoria, imagem, descricao, preco, estoque)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        categoria.trim(),
        typeof imagem === 'string' ? imagem : '',
        typeof descricao === 'string' ? descricao : '',
        preco,
        estoque
      ]
    );

    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [resultado.insertId]
    );

    res.status(201).json(produtos[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao cadastrar produto'
    });
  }
});




app.put('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nome, categoria, imagem, descricao, preco, estoque } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof categoria !== 'string' || !categoria.trim() ||
    typeof preco !== 'number' || !Number.isFinite(preco) || preco < 0 ||
    !Number.isInteger(estoque) || estoque < 0
  ) {
    return res.status(400).json({
      mensagem: 'Nome, categoria, preço e estoque válidos são obrigatórios'
    });
  }

  try {
    const [resultado] = await db.query(
      `UPDATE produtos
       SET nome = ?, categoria = ?, imagem = ?,
           descricao = ?, preco = ?, estoque = ?
       WHERE id = ?`,
      [
        nome.trim(),
        categoria.trim(),
        typeof imagem === 'string' ? imagem : '',
        typeof descricao === 'string' ? descricao : '',
        preco,
        estoque,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    const [produtos] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );

    res.json(produtos[0]);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao atualizar produto'
    });
  }
});



app.delete('/api/produtos/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido'
    });
  }

  try {
    const [resultado] = await db.query(
      'DELETE FROM produtos WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      mensagem: 'Erro ao excluir produto'
    });
  }
});


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
