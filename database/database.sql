
-- ==========================================
-- NERD ANGOLA PLANET
-- Banco de dados do projeto
-- ==========================================

-- Cria o banco de dados caso não exista
CREATE DATABASE IF NOT EXISTS nerd_angola_planet;

-- Seleciona o banco utilizado pela aplicação
USE nerd_angola_planet;


-- ==========================================
-- TABELA DE PRODUTOS
-- ==========================================

-- Armazena os produtos disponíveis na loja
CREATE TABLE IF NOT EXISTS produtos (

    -- Identificador único de cada produto
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Nome do produto
    nome VARCHAR(150) NOT NULL,

    -- Categoria do produto
    categoria VARCHAR(100) NOT NULL,

    -- Descrição do produto
    descricao TEXT,

    -- Caminho da imagem do produto
    imagem VARCHAR(255),

    -- Preço do produto
    preco DECIMAL(10,2) NOT NULL,

    -- Quantidade disponível no estoque
    estoque INT NOT NULL DEFAULT 0

);


-- ==========================================
-- CADASTRO INICIAL DE PRODUTOS
-- ==========================================

-- Cadastra os produtos apenas quando ainda
-- não existe um produto com o mesmo nome
-- e categoria.

INSERT INTO produtos
(nome, categoria, descricao, imagem, preco, estoque)

SELECT
    'Monkey D. Luffy Gear 5',
    'One Piece',
    'Figure colecionável do Luffy em sua transformação Gear 5.',
    '/images/luffy.png',
    199.90,
    10
WHERE NOT EXISTS (
    SELECT 1 FROM produtos
    WHERE nome = 'Monkey D. Luffy Gear 5'
      AND categoria = 'One Piece'
);


INSERT INTO produtos
(nome, categoria, descricao, imagem, preco, estoque)

SELECT
    'Satoru Gojo',
    'Jujutsu Kaisen',
    'Figure colecionável do Satoru Gojo.',
    '/images/gojo.png',
    179.90,
    8
WHERE NOT EXISTS (
    SELECT 1 FROM produtos
    WHERE nome = 'Satoru Gojo'
      AND categoria = 'Jujutsu Kaisen'
);


INSERT INTO produtos
(nome, categoria, descricao, imagem, preco, estoque)

SELECT
    'Frieren',
    'Frieren e a Jornada para o Além',
    'Figure colecionável da Frieren.',
    '/images/frieren.png',
    189.90,
    5
WHERE NOT EXISTS (
    SELECT 1 FROM produtos
    WHERE nome = 'Frieren'
      AND categoria = 'Frieren e a Jornada para o Além'
);


-- ==========================================
-- CONSULTA DOS PRODUTOS
-- ==========================================

-- Exibe os produtos cadastrados
SELECT * FROM produtos;
