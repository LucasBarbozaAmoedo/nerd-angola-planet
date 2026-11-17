
/*
  NERD ANGOLA PLANET
  Testes automatizados das rotas da API

  Ferramentas:
  - Jest: execução e verificações dos testes
  - Supertest: requisições HTTP ao Express

  O MySQL é simulado para evitar alterações
  nos produtos reais durante os testes.
*/

const request = require('supertest');

// Simula o módulo de banco de dados.
jest.mock('../db', () => ({
  query: jest.fn()
}));

const app = require('../app');
const db = require('../db');

// Produto de referência utilizado nos testes.
const produtoValido = {
  nome: 'Figure Gojo',
  categoria: 'Jujutsu Kaisen',
  imagem: 'gojo.jpg',
  descricao: 'Figure colecionável',
  preco: 149.90,
  estoque: 10
};

// Executa um teste de falha do banco sem
// exibir mensagens de erro esperadas no terminal.
async function testarErroBanco(requisicao, mensagemEsperada) {
  const consoleSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  try {
    db.query.mockRejectedValueOnce(
      new Error('Falha simulada no banco')
    );

    const resposta = await requisicao();

    expect(resposta.status).toBe(500);
    expect(resposta.body.mensagem).toBe(mensagemEsperada);
    expect(consoleSpy).toHaveBeenCalled();

  } finally {
    consoleSpy.mockRestore();
  }
}

describe('Testes de integração HTTP - API de produtos', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*
    ROTA INICIAL
  */

  test('01 - GET / retorna status 200', async () => {
    const resposta = await request(app).get('/');

    expect(resposta.status).toBe(200);
    expect(resposta.body.mensagem).toBe(
      'API Nerd Angola Planet funcionando!'
    );
  });

  /*
    GET - LISTAR PRODUTOS
  */

  test('02 - GET lista todos os produtos', async () => {
    const produtos = [
      { id: 1, ...produtoValido }
    ];

    db.query.mockResolvedValueOnce([produtos]);

    const resposta = await request(app).get('/api/produtos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(produtos);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM produtos'
    );
  });

  test('03 - GET retorna lista vazia', async () => {
    db.query.mockResolvedValueOnce([[]]);

    const resposta = await request(app).get('/api/produtos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual([]);
  });

  test('04 - GET trata erro ao listar produtos', async () => {
    await testarErroBanco(
      () => request(app).get('/api/produtos'),
      'Erro ao buscar produtos'
    );
  });

  /*
    GET - CONSULTAR PRODUTO POR ID
  */

  test('05 - GET por ID retorna produto existente', async () => {
    const produto = { id: 1, ...produtoValido };

    db.query.mockResolvedValueOnce([[produto]]);

    const resposta = await request(app).get('/api/produtos/1');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(produto);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM produtos WHERE id = ?',
      [1]
    );
  });

  test('06 - GET por ID retorna 404 para produto inexistente', async () => {
    db.query.mockResolvedValueOnce([[]]);

    const resposta = await request(app).get('/api/produtos/999');

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe(
      'Produto não encontrado'
    );
  });

  test('07 - GET por ID rejeita identificador inválido', async () => {
    const resposta = await request(app).get('/api/produtos/abc');

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe('ID inválido');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('08 - GET por ID rejeita identificador negativo', async () => {
    const resposta = await request(app).get('/api/produtos/-5');

    expect(resposta.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('09 - GET por ID trata erro do banco', async () => {
    await testarErroBanco(
      () => request(app).get('/api/produtos/1'),
      'Erro ao buscar produto'
    );
  });

  /*
    POST - CADASTRAR PRODUTO
  */

  test('10 - POST cadastra produto válido', async () => {
    const produtoCadastrado = {
      id: 4,
      ...produtoValido
    };

    // Simula o INSERT.
    db.query.mockResolvedValueOnce([
      { insertId: 4 }
    ]);

    // Simula o SELECT após o INSERT.
    db.query.mockResolvedValueOnce([
      [produtoCadastrado]
    ]);

    const resposta = await request(app)
      .post('/api/produtos')
      .send(produtoValido);

    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual(produtoCadastrado);

    expect(db.query).toHaveBeenCalledTimes(2);

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('INSERT INTO produtos'),
      [
        'Figure Gojo',
        'Jujutsu Kaisen',
        'gojo.jpg',
        'Figure colecionável',
        149.90,
        10
      ]
    );

    expect(db.query).toHaveBeenNthCalledWith(
      2,
      'SELECT * FROM produtos WHERE id = ?',
      [4]
    );
  });

  test('11 - POST rejeita nome vazio', async () => {
    const resposta = await request(app)
      .post('/api/produtos')
      .send({
        ...produtoValido,
        nome: ''
      });

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe(
      'Dados do produto inválidos'
    );
    expect(db.query).not.toHaveBeenCalled();
  });

  test('12 - POST rejeita preço negativo', async () => {
    const resposta = await request(app)
      .post('/api/produtos')
      .send({
        ...produtoValido,
        preco: -10
      });

    expect(resposta.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('13 - POST rejeita estoque inválido', async () => {
    const resposta = await request(app)
      .post('/api/produtos')
      .send({
        ...produtoValido,
        estoque: -1
      });

    expect(resposta.status).toBe(400);
    expect(db.query).not.toHaveBeenCalled();
  });

  test('14 - POST trata erro do banco', async () => {
    await testarErroBanco(
      () => request(app)
        .post('/api/produtos')
        .send(produtoValido),
      'Erro ao cadastrar produto'
    );
  });

  /*
    PUT - ATUALIZAR PRODUTO
  */

  test('15 - PUT atualiza produto existente', async () => {
    const produtoAtualizado = {
      ...produtoValido,
      nome: 'Figure Gojo Atualizada',
      preco: 179.90,
      estoque: 8
    };

    db.query.mockResolvedValueOnce([
      { affectedRows: 1 }
    ]);

    db.query.mockResolvedValueOnce([
      [{ id: 4, ...produtoAtualizado }]
    ]);

    const resposta = await request(app)
      .put('/api/produtos/4')
      .send(produtoAtualizado);

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual({
      id: 4,
      ...produtoAtualizado
    });

    expect(db.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('UPDATE produtos'),
      [
        'Figure Gojo Atualizada',
        'Jujutsu Kaisen',
        'gojo.jpg',
        'Figure colecionável',
        179.90,
        8,
        4
      ]
    );

    expect(db.query).toHaveBeenCalledTimes(2);
  });

  test('16 - PUT rejeita ID inválido', async () => {
    const resposta = await request(app)
      .put('/api/produtos/abc')
      .send(produtoValido);

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe('ID inválido');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('17 - PUT rejeita dados inválidos', async () => {
    const resposta = await request(app)
      .put('/api/produtos/4')
      .send({
        ...produtoValido,
        nome: ''
      });

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe(
      'Dados do produto inválidos'
    );
    expect(db.query).not.toHaveBeenCalled();
  });

  test('18 - PUT retorna 404 para produto inexistente', async () => {
    db.query.mockResolvedValueOnce([
      { affectedRows: 0 }
    ]);

    const resposta = await request(app)
      .put('/api/produtos/999')
      .send(produtoValido);

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe(
      'Produto não encontrado'
    );

    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('19 - PUT trata erro do banco', async () => {
    await testarErroBanco(
      () => request(app)
        .put('/api/produtos/4')
        .send(produtoValido),
      'Erro ao atualizar produto'
    );
  });

  /*
    DELETE - EXCLUIR PRODUTO
  */

  test('20 - DELETE exclui produto existente', async () => {
    db.query.mockResolvedValueOnce([
      { affectedRows: 1 }
    ]);

    const resposta = await request(app)
      .delete('/api/produtos/4');

    expect(resposta.status).toBe(204);
    expect(resposta.text).toBe('');

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM produtos WHERE id = ?',
      [4]
    );
  });

  test('21 - DELETE rejeita ID inválido', async () => {
    const resposta = await request(app)
      .delete('/api/produtos/abc');

    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe('ID inválido');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('22 - DELETE retorna 404 para produto inexistente', async () => {
    db.query.mockResolvedValueOnce([
      { affectedRows: 0 }
    ]);

    const resposta = await request(app)
      .delete('/api/produtos/999');

    expect(resposta.status).toBe(404);
    expect(resposta.body.mensagem).toBe(
      'Produto não encontrado'
    );
  });

  test('23 - DELETE trata erro do banco', async () => {
    await testarErroBanco(
      () => request(app).delete('/api/produtos/4'),
      'Erro ao excluir produto'
    );
  });

});
