
import { Component, inject } from '@angular/core';

// Importa o serviço responsável por armazenar os produtos
// O caminho sobe duas pastas até chegar em services
import {
  Carrinho as CarrinhoService
} from '../../services/carrinho';

@Component({
  selector: 'app-carrinho',
  imports: [],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {

  // Conecta esta página ao serviço global do carrinho
  // O serviço mantém os produtos salvos no navegador
  readonly carrinho = inject(CarrinhoService);

  // Aumenta a quantidade de um produto
  // O serviço impede ultrapassar o estoque disponível
  aumentarQuantidade(id: number, quantidadeAtual: number): void {
    this.carrinho.alterarQuantidade(id, quantidadeAtual + 1);
  }

  // Diminui a quantidade de um produto
  // O serviço mantém o mínimo de uma unidade
  diminuirQuantidade(id: number, quantidadeAtual: number): void {
    this.carrinho.alterarQuantidade(id, quantidadeAtual - 1);
  }

  // Remove um produto específico do carrinho
  removerProduto(id: number): void {
    this.carrinho.removerProduto(id);
  }

  // Remove todos os produtos do carrinho
  limparCarrinho(): void {
    this.carrinho.limparCarrinho();
  }

  // Formata os valores para a moeda brasileira
  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
