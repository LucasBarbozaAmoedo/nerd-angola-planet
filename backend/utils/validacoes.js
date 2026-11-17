
/*
  NERD ANGOLA PLANET
  Funções auxiliares para validação de produtos

  Essas funções são utilizadas pela API e
  podem ser testadas individualmente.
*/

// Verifica se o ID é um número inteiro positivo e seguro.
function validarId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

// Valida os dados necessários para cadastrar ou atualizar produtos.
function validarProduto(produto) {

  // Impede valores nulos, tipos inválidos e arrays.
  if (
    !produto ||
    typeof produto !== 'object' ||
    Array.isArray(produto)
  ) {
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

  // Verifica os campos obrigatórios e seus tamanhos.
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

  // Verifica os campos opcionais.
  if (
    (imagem !== undefined &&
      (typeof imagem !== 'string' || imagem.length > 255)) ||
    (descricao !== undefined &&
      typeof descricao !== 'string')
  ) {
    return false;
  }

  // Valida o preço conforme o limite do banco de dados.
  if (
    typeof preco !== 'number' ||
    !Number.isFinite(preco) ||
    preco < 0 ||
    preco >= 100000000
  ) {
    return false;
  }

  // Valida o estoque.
  if (
    !Number.isInteger(estoque) ||
    estoque < 0 ||
    estoque > 2147483647
  ) {
    return false;
  }

  return true;
}

// Prepara os valores antes das operações no MySQL.
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

// Disponibiliza as funções para outros arquivos.
module.exports = {
  validarId,
  validarProduto,
  prepararProduto
};
