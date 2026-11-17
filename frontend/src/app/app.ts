
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Nerd Angola Planet');

  pesquisa = signal('');

  atualizarPesquisa(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }
}
