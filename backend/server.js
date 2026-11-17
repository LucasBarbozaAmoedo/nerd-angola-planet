
const express = require('express');

const app = express();
const PORT = 3000;

// Permite receber dados em JSON
app.use(express.json());

// Rota inicial da API
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Nerd Angola Planet funcionando!'
  });
});

const produtos = [
  {
    id: 1,
    nome: 'Monkey D. Luffy Gear 5',
    categoria: 'One Piece',
    imagem: '/images/luffy.png',
    estoque: 5
  },
  {
    id: 2,
    nome: 'Satoru Gojo',
    categoria: 'Jujutsu Kaisen',
    imagem: '/images/gojo.png',
    estoque: 3
  },
  {
    id: 3,
    nome: 'Frieren',
    categoria: 'Frieren e a Jornada para o Além',
    imagem: '/images/frieren.png',
    estoque: 4
  }
];

// Retorna todos os produtos
app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const id = Number(req.params.id);

  const produto = produtos.find(item => item.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: 'Produto não encontrado'
    });
  }

  res.json(produto);
});

app.post('/api/produtos', (req, res) => {
  const { nome, categoria, imagem, estoque } = req.body;

  // Valida os dados recebidos
  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof categoria !== 'string' || !categoria.trim() ||
    !Number.isInteger(estoque) || estoque < 0
  ) {
    return res.status(400).json({
      mensagem: 'Nome, categoria e estoque válido são obrigatórios'
    });
  }

  const novoProduto = {
    id: Math.max(0, ...produtos.map(item => item.id)) + 1,
    nome: nome.trim(),
    categoria: categoria.trim(),
    imagem: typeof imagem === 'string' ? imagem : '',
    estoque
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});

app.put('/api/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = produtos.find(item => item.id === id);

  if (!produto) {
    return res.status(404).json({
      mensagem: 'Produto não encontrado'
    });
  }

  const { nome, categoria, imagem, estoque } = req.body;

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof categoria !== 'string' || !categoria.trim() ||
    !Number.isInteger(estoque) || estoque < 0
  ) {
    return res.status(400).json({
      mensagem: 'Nome, categoria e estoque válido são obrigatórios'
    });
  }

  produto.nome = nome.trim();
  produto.categoria = categoria.trim();
  produto.imagem = typeof imagem === 'string' ? imagem : '';
  produto.estoque = estoque;

  res.json(produto);
});

app.delete('/api/produtos/:id', (req, res) => {
  const id = Number(req.params.id);

  const indice = produtos.findIndex(item => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensagem: 'Produto não encontrado'
    });
  }

  produtos.splice(indice, 1);

  res.status(204).send();
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
