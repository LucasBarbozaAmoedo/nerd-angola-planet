

import { Routes } from '@angular/router';

// Importa a página inicial, que exibe o catálogo
import { Inicio } from './pages/inicio/inicio';

// Importa a página de detalhes de cada produto
import { DetalhesProduto } from './pages/detalhes-produto/detalhes-produto';

// Importa a página do carrinho de compras
import { Carrinho } from './pages/carrinho/carrinho';

// Define os caminhos disponíveis no site
export const routes: Routes = [

  // Página inicial: catálogo de produtos
  {
    path: '',
    component: Inicio
  },

  // Página de detalhes: identifica o produto pelo ID
  {
    path: 'produto/:id',
    component: DetalhesProduto
  },

  // Página do carrinho de compras
  {
    path: 'carrinho',
    component: Carrinho
  }

];
