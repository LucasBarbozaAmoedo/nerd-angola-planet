
import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { DetalhesProduto } from './pages/detalhes-produto/detalhes-produto';

export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  {
    path: 'produto/:id',
    component: DetalhesProduto
  }
];
