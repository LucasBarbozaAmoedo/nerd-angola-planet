
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// Importa o serviço que gerencia o carrinho de compras
import { Carrinho } from './services/carrinho';

@Component({
  selector: 'app-root',

  // Permite usar as rotas e os links no HTML
  imports: [RouterOutlet, RouterLink],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // Nome do projeto
  protected readonly title = signal('Nerd Angola Planet');

  // Armazena o texto digitado na pesquisa
  pesquisa = signal('');

  // Conecta o cabeçalho ao serviço global do carrinho
  // O contador será atualizado automaticamente
  readonly carrinho = inject(Carrinho);

  // Atualiza o texto da pesquisa
  atualizarPesquisa(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }
}
