
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// Serviço responsável pelo carrinho de compras
import { Carrinho } from './services/carrinho';

@Component({
  selector: 'app-root',

  // Permite utilizar as rotas e os links no HTML
  imports: [RouterOutlet, RouterLink],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // Nome do projeto
  protected readonly title = signal('Nerd Angola Planet');

  // Armazena o texto digitado na pesquisa
  pesquisa = signal('');

  // Conecta o cabeçalho ao carrinho de compras
  readonly carrinho = inject(Carrinho);

  // Controla se o modo de alto contraste está ativado
  altoContraste = signal(false);

  // Atualiza o texto da pesquisa
  atualizarPesquisa(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }

  // Ativa ou desativa o modo de alto contraste
  alternarContraste(): void {
    const ativado = !this.altoContraste();

    this.altoContraste.set(ativado);

    // Aplica a classe ao documento inteiro,
    // incluindo as páginas do catálogo e do carrinho
    document.documentElement.classList.toggle(
      'alto-contraste',
      ativado
    );
  }
}
