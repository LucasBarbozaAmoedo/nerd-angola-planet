
/* ==========================================
   NERD ANGOLA PLANET
   API REST - Gerenciamento de Produtos
========================================== */

// Importação das dependências
const express = require('express');
const db = require('./db');
const cors = require('cors');

// Inicialização do servidor Express
const app = express();
const PORT = 3000;

// Permite requisições do frontend Angular
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Permite receber requisições com dados JSON
app.use(express.json());


/* ==========================================
   FUNÇÕES AUXILIARES
========================================== */

/*
  Valida o identificador recebido pela URL.

  O ID precisa ser um número inteiro positivo.
*/
function validarId(id) {
  return Number.isSafeInteger(id) && id > 0;
}


/*
  Valida os dados enviados para cadastrar
  ou atualizar um produto.

  Centralizar essa validação evita repetir
  as mesmas condições nas rotas POST e PUT.
*/
function validarProduto(produto) {

  if (!produto || typeof produto !== 'object' ||
      Array.isArray(produto)) {
    return false;
  }

  const {
    nome,
    categoria,
    imagem,
    descricao,
    preco,
    estoque
  } = produto;

  // Nome e categoria são obrigatórios
  if (
    typeof nome !== 'string' ||
    !nome.trim() ||
    nome.trim().length > 150 ||
    typeof categoria !== 'string' ||
    !categoria.trim() ||
    categoria.trim().length > 100
  ) {
    return false;
  }

  // Imagem e descrição são opcionais,
  // mas devem ser textos quando informadas
  if (
    (imagem !== undefined &&
      (typeof imagem !== 'string' || imagem.length > 255)) ||
    (descricao !== undefined &&
      typeof descricao !== 'string')
  ) {
    return false;
  }

  // Preço precisa ser um número válido
  // dentro do limite do DECIMAL(10,2)
  if (
    typeof preco !== 'number' ||
    !Number.isFinite(preco) ||
    preco < 0 ||
    preco >= 100000000
  ) {
    return false;
  }

  // Estoque precisa ser um inteiro não negativo
  // dentro do limite de INT do MySQL
  if (
    !Number.isInteger(estoque) ||
    estoque < 0 ||
    estoque > 2147483647
  ) {
    return false;
  }

  return true;
}


/*
  Organiza os dados do produto antes
  de enviá-los ao banco de dados.
*/
function prepararProduto(produto) {

  return [
    produto.nome.trim(),
    produto.categoria.trim(),
    typeof produto.imagem === 'string'
      ? produto.imagem
      : '',
    typeof produto.descricao === 'string'
      ? produto.descricao
      : '',
    produto.preco,
    produto.estoque
  ];
}


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

    // O parâmetro ? evita concatenar o ID
    // diretamente na consulta SQL
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

  // Utiliza a função de validação compartilhada
  if (!validarProduto(req.body)) {
    return res.status(400).json({
      mensagem: 'Dados do produto inválidos'
    });
  }

  try {

    // Prepara os valores para inserção
    const dados = prepararProduto(req.body);

    // Insere o produto utilizando parâmetros SQL
    const [resultado] = await db.query(
      `INSERT INTO produtos
       (nome, categoria, imagem, descricao, preco, estoque)
       VALUES (?, ?, ?, ?, ?, ?)`,
      dados
    );

    // Consulta o produto recém-cadastrado
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

  // Verifica se o ID é válido
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

    // Prepara os dados e adiciona o ID
    // utilizado na condição WHERE
    const dados = [
      ...prepararProduto(req.body),
      id
    ];

    // Atualiza o produto no MySQL
    const [resultado] = await db.query(
      `UPDATE produtos
       SET nome = ?, categoria = ?, imagem = ?,
           descricao = ?, preco = ?, estoque = ?
       WHERE id = ?`,
      dados
    );

    // Retorna 404 quando o produto não existe
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    // Consulta o produto atualizado
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

    // Remove o produto pelo ID
    const [resultado] = await db.query(
      'DELETE FROM produtos WHERE id = ?',
      [id]
    );

    // Verifica se algum produto foi removido
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: 'Produto não encontrado'
      });
    }

    // Retorna sucesso sem conteúdo
    res.status(204).send();

  } catch (erro) {

    console.error('Erro ao excluir produto:', erro);

    res.status(500).json({
      mensagem: 'Erro ao excluir produto'
    });

  }

});


/* ==========================================
   INICIALIZAÇÃO DO SERVIDOR
========================================== */

// Inicia a API na porta 3000
app.listen(PORT, () => {

  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );

});
