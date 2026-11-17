
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  pesquisa = signal('');

  atualizarPesquisa(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pesquisa.set(input.value.toLowerCase());
  }
}
