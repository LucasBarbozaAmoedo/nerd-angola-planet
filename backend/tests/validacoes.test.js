
/*
  NERD ANGOLA PLANET
  Testes unitários das funções de validação
*/

const {
  validarId,
  validarProduto,
  prepararProduto
} = require('../utils/validacoes');

// Produto válido utilizado como referência nos testes
const produtoValido = {
  nome: 'Monkey D. Luffy',
  categoria: 'One Piece',
  imagem: '/images/luffy.png',
  descricao: 'Figure colecionável',
  preco: 199.90,
  estoque: 10
};

describe('Testes unitários - Validação de ID', () => {

  test('Aceita identificadores positivos', () => {
    expect(validarId(1)).toBe(true);
    expect(validarId(100)).toBe(true);
  });

  test('Rejeita identificadores inválidos', () => {
    expect(validarId(0)).toBe(false);
    expect(validarId(-1)).toBe(false);
    expect(validarId(1.5)).toBe(false);
    expect(validarId(NaN)).toBe(false);
    expect(validarId('1')).toBe(false);
  });

});

describe('Testes unitários - Validação de produtos', () => {

  test('Aceita um produto válido', () => {
    expect(validarProduto(produtoValido)).toBe(true);
  });

  test('Rejeita produtos nulos ou arrays', () => {
    expect(validarProduto(null)).toBe(false);
    expect(validarProduto([])).toBe(false);
  });

  test('Rejeita nome vazio', () => {
    expect(validarProduto({
      ...produtoValido,
      nome: ''
    })).toBe(false);
  });

  test('Rejeita nome acima do limite', () => {
    expect(validarProduto({
      ...produtoValido,
      nome: 'A'.repeat(151)
    })).toBe(false);
  });

  test('Rejeita categoria vazia', () => {
    expect(validarProduto({
      ...produtoValido,
      categoria: ''
    })).toBe(false);
  });

  test('Rejeita imagem com tamanho inválido', () => {
    expect(validarProduto({
      ...produtoValido,
      imagem: 'A'.repeat(256)
    })).toBe(false);
  });

  test('Rejeita preço negativo', () => {
    expect(validarProduto({
      ...produtoValido,
      preco: -10
    })).toBe(false);
  });

  test('Rejeita preço que não é número', () => {
    expect(validarProduto({
      ...produtoValido,
      preco: '199.90'
    })).toBe(false);
  });

  test('Rejeita estoque negativo ou decimal', () => {
    expect(validarProduto({
      ...produtoValido,
      estoque: -1
    })).toBe(false);

    expect(validarProduto({
      ...produtoValido,
      estoque: 2.5
    })).toBe(false);
  });

});

describe('Testes unitários - Preparação dos dados', () => {

  test('Remove espaços do nome e categoria', () => {
    const dados = prepararProduto({
      ...produtoValido,
      nome: '  Monkey D. Luffy  ',
      categoria: '  One Piece  '
    });

    expect(dados[0]).toBe('Monkey D. Luffy');
    expect(dados[1]).toBe('One Piece');
  });

  test('Preenche campos opcionais ausentes', () => {
    const dados = prepararProduto({
      nome: 'Produto',
      categoria: 'Teste',
      preco: 50,
      estoque: 2
    });

    expect(dados).toEqual([
      'Produto',
      'Teste',
      '',
      '',
      50,
      2
    ]);
  });

});
