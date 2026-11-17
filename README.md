# Nerd Angola Planet

## Sobre o projeto

A **Nerd Angola Planet** é um projeto de e-commerce voltado à cultura geek, desenvolvido como atividade acadêmica do curso de Análise e Desenvolvimento de Sistemas.

A plataforma tem como objetivo oferecer um ambiente digital para a exposição e comercialização de figures, colecionáveis e produtos relacionados ao universo geek.

O sistema permite consultar produtos, realizar pesquisas no catálogo, visualizar informações detalhadas e gerenciar um carrinho de compras.

Além disso, a aplicação conta com uma API REST integrada a um banco de dados MySQL, responsável pelo armazenamento e gerenciamento dos produtos e de seus respectivos estoques.

## Tecnologias utilizadas

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MySQL
- mysql2
- CORS
- dotenv

### Ferramentas de desenvolvimento
- Visual Studio Code
- Git
- GitHub
- npm

## Funcionalidades

### Catálogo de produtos
- Listagem de produtos cadastrados no banco de dados.
- Pesquisa por nome ou categoria.
- Exibição de imagens e informações dos produtos.
- Navegação para páginas individuais de detalhes.

### Detalhes dos produtos
- Exibição do nome, categoria e descrição.
- Consulta de preços e disponibilidade em estoque.
- Seleção da quantidade desejada.
- Cálculo automático do valor total.
- Adição de produtos ao carrinho de compras.

### Carrinho de compras
- Adição de diferentes produtos.
- Aumento e diminuição das quantidades.
- Controle de quantidade conforme o estoque disponível.
- Remoção individual de produtos.
- Opção para esvaziar o carrinho.
- Cálculo automático do valor total.
- Contador de itens no cabeçalho.
- Persistência dos dados no navegador utilizando localStorage.

### Gerenciamento de produtos

O backend disponibiliza uma API REST com operações CRUD, permitindo consultar, cadastrar, atualizar e excluir produtos.

| Método | Endpoint | Funcionalidade |
|---|---|---|
| GET | `/api/produtos` | Listar todos os produtos |
| GET | `/api/produtos/:id` | Consultar um produto específico |
| POST | `/api/produtos` | Cadastrar um novo produto |
| PUT | `/api/produtos/:id` | Atualizar um produto existente |
| DELETE | `/api/produtos/:id` | Excluir um produto |

## Arquitetura do sistema

O projeto utiliza uma arquitetura cliente-servidor, separando a interface do usuário, a lógica de negócio e o armazenamento dos dados.

**Frontend (Angular):** responsável pela interface, navegação, pesquisa e interação do usuário com os produtos e o carrinho.

**Backend (Node.js e Express):** responsável pelo processamento das requisições HTTP e pela comunicação com o banco de dados.

**Banco de dados (MySQL):** responsável pelo armazenamento das informações dos produtos, incluindo nome, categoria, descrição, preço, imagem e estoque.

A comunicação entre frontend e backend ocorre por meio de requisições HTTP, utilizando uma API REST e dados em formato JSON.

## Estrutura do projeto

```text
nerd-angola-planet/
├── backend/
│   ├── db.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── pages/
│   │       │   ├── inicio/
│   │       │   ├── detalhes-produto/
│   │       │   └── carrinho/
│   │       ├── services/
│   │       │   └── carrinho.ts
│   │       └── app.routes.ts
│   └── package.json
│
├── .gitignore
└── README.md
```

## Como executar o projeto

### Pré-requisitos

Para executar a aplicação localmente, é necessário ter instalado:

- Node.js e npm
- MySQL
- Angular CLI
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/LucasBarbozaAmoedo/nerd-angola-planet.git
cd nerd-angola-planet
```


### 2. Configurar o banco de dados

Abra o MySQL Workbench e execute o script disponível em:

`database/database.sql`

Esse script cria o banco de dados `nerd_angola_planet`, a tabela `produtos` e cadastra os produtos iniciais.

Depois, na pasta `backend`, copie o arquivo `.env.example` para um novo arquivo chamado `.env`.

Preencha o `.env` com as credenciais do seu MySQL.

O arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

### 3. Executar o backend

Abra um terminal e acesse a pasta do backend:

```bash
cd backend
npm install
node server.js
```

A API estará disponível em:

http://localhost:3000

Para consultar os produtos:

http://localhost:3000/api/produtos

### 4. Executar o frontend

Abra outro terminal na pasta principal do projeto e execute:

```bash
cd frontend
npm install
ng serve
```

A aplicação estará disponível em:

http://localhost:4200

**Observação:** o backend e o frontend precisam estar em execução simultaneamente para que a aplicação consulte os produtos do banco de dados.

## Testes realizados

Foram realizados testes manuais para verificar o funcionamento das principais funcionalidades:

- Carregamento dos produtos cadastrados.
- Pesquisa de produtos no catálogo.
- Navegação para a página de detalhes.
- Aumento e diminuição da quantidade selecionada.
- Respeito aos limites de estoque.
- Adição de produtos ao carrinho.
- Atualização automática dos valores.
- Remoção de produtos.
- Persistência do carrinho após atualizar a página.
- Limpeza do carrinho e atualização do contador.

Os testes foram concluídos com sucesso no ambiente local de desenvolvimento.

## Limitações e melhorias futuras

A Nerd Angola Planet foi desenvolvida como um Produto Mínimo Viável (MVP), com foco nas funcionalidades essenciais de um comércio eletrônico.

Atualmente, o sistema não possui integração com serviços de pagamento nem processamento real de pedidos.

Entre as possíveis melhorias futuras estão:

- Implementação de cadastro e autenticação de usuários.
- Desenvolvimento de uma área administrativa.
- Gerenciamento de pedidos.
- Integração com sistemas de pagamento.
- Implementação de filtros avançados de produtos.
- Ampliação do catálogo.
- Publicação da aplicação em um ambiente de hospedagem.

## Objetivos acadêmicos

O desenvolvimento da Nerd Angola Planet permitiu aplicar conhecimentos relacionados a:

- Desenvolvimento de aplicações web.
- Programação frontend e backend.
- Criação e consumo de APIs REST.
- Integração com bancos de dados relacionais.
- Manipulação de dados com TypeScript.
- Componentização e organização de serviços.
- Persistência de dados no navegador.
- Controle de versão utilizando Git e GitHub.
- Desenvolvimento de interfaces responsivas.

## Autor

**Lucas dos Santos Barboza Amoedo**

Estudante de Análise e Desenvolvimento de Sistemas.

Projeto desenvolvido para fins acadêmicos.