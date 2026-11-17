
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Importa o serviço responsável pelo carrinho de compras
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
  selector: 'app-detalhes-produto',
  imports: [],
  templateUrl: './detalhes-produto.html',
  styleUrl: './detalhes-produto.css',
})
export class DetalhesProduto {

  // Permite identificar qual produto foi aberto pela URL
  private rota = inject(ActivatedRoute);

  // Permite buscar os produtos no backend
  private http = inject(HttpClient);

  // Permite adicionar produtos ao carrinho
  private carrinho = inject(Carrinho);

  // Armazena as informações do produto carregado
  produto = signal<Produto | undefined>(undefined);

  // Controla a quantidade selecionada pelo usuário
  quantidade = signal(1);

  // Controla a mensagem exibida após adicionar ao carrinho
  mensagemCarrinho = signal('');

  // Aumenta a quantidade sem ultrapassar o estoque
  aumentarQuantidade(): void {
    const estoque = this.produto()?.estoque ?? 0;

    if (this.quantidade() < estoque) {
      this.quantidade.update(valor => valor + 1);
    }
  }

  // Diminui a quantidade, mantendo o mínimo de 1 unidade
  diminuirQuantidade(): void {
    if (this.quantidade() > 1) {
      this.quantidade.update(valor => valor - 1);
    }
  }

  // Adiciona o produto e a quantidade selecionada ao carrinho
  adicionarAoCarrinho(): void {

    // Obtém o produto que está sendo visualizado
    const produtoAtual = this.produto();

    // Impede adicionar produtos inexistentes ou esgotados
    if (!produtoAtual || produtoAtual.estoque <= 0) {
      return;
    }

    // Envia os dados do produto para o serviço do carrinho
    this.carrinho.adicionarProduto(
      produtoAtual,
      this.quantidade()
    );

    // Informa ao usuário que o produto foi adicionado
    this.mensagemCarrinho.set(
      'Produto adicionado ao carrinho!'
    );
  }

  constructor() {

    // Observa o ID do produto presente na URL
    this.rota.paramMap.subscribe(params => {
      const id = params.get('id');

      // Se não houver ID, limpa as informações
      if (!id) {
        this.produto.set(undefined);
        this.mensagemCarrinho.set('');
        return;
      }

      // Limpa os dados anteriores ao trocar de produto
      this.produto.set(undefined);
      this.quantidade.set(1);
      this.mensagemCarrinho.set('');

      // Busca o produto correspondente no backend Express
      this.http
        .get<Produto>(`http://localhost:3000/api/produtos/${id}`)
        .subscribe({

          // Executado quando a API retorna o produto
          next: (dados) => {
            this.produto.set(dados);
            this.quantidade.set(1);
          },

          // Executado se ocorrer algum erro na requisição
          error: (erro) => {
            console.error('Erro ao carregar produto:', erro);
            this.produto.set(undefined);
          }
        });
    });
  }
}
