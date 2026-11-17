
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Importa o serviço que gerencia o carrinho de compras
import { Carrinho } from '../../services/carrinho';

// Define a estrutura dos produtos recebidos da API
interface Produto {
  id: number;
  nome: string;
  categoria: string;
  imagem: string;
  descricao: string;
  preco: number;
  estoque: number;
}

@Component({
  selector: 'app-inicio',

  // Permite navegar entre as páginas usando routerLink
  imports: [RouterLink],

  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {

  // Armazena os produtos recebidos do backend
  produtos = signal<Produto[]>([]);

  // Armazena o texto digitado na pesquisa
  pesquisa = signal('');

  // Conecta a página ao serviço global do carrinho
  // Permite consultar a quantidade total de produtos
  readonly carrinho = inject(Carrinho);

  // Injeta o HttpClient para realizar requisições à API
  constructor(private http: HttpClient) {}

  // Executado quando a página inicial é carregada
  ngOnInit(): void {

    // Busca os produtos cadastrados no MySQL por meio do backend
    this.http
      .get<Produto[]>('http://localhost:3000/api/produtos')
      .subscribe({

        // Atualiza a lista quando os produtos são recebidos
        next: (dados) => {
          this.produtos.set(dados);
        },

        // Exibe o erro no console se a requisição falhar
        error: (erro) => {
          console.error('Erro ao carregar produtos:', erro);
        }
      });
  }

  // Filtra os produtos pelo nome ou categoria
  produtosFiltrados(): Produto[] {
    return this.produtos().filter(produto =>
      (produto.nome + ' ' + produto.categoria)
        .toLowerCase()
        .includes(this.pesquisa())
    );
  }

  // Atualiza a pesquisa conforme o usuário digita
  atualizarPesquisa(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.pesquisa.set(input.value.toLowerCase());
  }
}
