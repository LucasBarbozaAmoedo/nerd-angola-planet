
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Nerd Angola Planet');

  // Texto digitado na pesquisa
  pesquisa = signal('');

  // Atualiza a pesquisa conforme o usuário digita
  atualizarPesquisa(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }
}
