
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { produtos } from '../../data/produtos';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  produtos = produtos;

produtosFiltrados() {
  return this.produtos.filter(produto =>
    (produto.nome + ' ' + produto.categoria)
      .toLowerCase()
      .includes(this.pesquisa())
  );
}


  pesquisa = signal('');

  atualizarPesquisa(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }
}
