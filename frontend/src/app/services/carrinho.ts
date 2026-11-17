
import { Injectable, computed, signal } from '@angular/core';

// Define as informações de um produto
export interface ProdutoCarrinho {
  id: number;
  nome: string;
  categoria: string;
  imagem: string;
  preco: number;
  estoque: number;
}

// Representa um produto adicionado ao carrinho
export interface ItemCarrinho extends ProdutoCarrinho {
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class Carrinho {

  // Chave utilizada para salvar o carrinho no navegador
  private readonly chaveStorage = 'nerd-angola-carrinho';

  // Armazena os produtos presentes no carrinho
  private itensSignal = signal<ItemCarrinho[]>(
    this.carregarCarrinho()
  );

  // Permite consultar os itens sem modificá-los diretamente
  readonly itens = this.itensSignal.asReadonly();

  // Calcula a quantidade total de unidades no carrinho
  readonly quantidadeTotal = computed(() =>
    this.itensSignal().reduce(
      (total, item) => total + item.quantidade,
      0
    )
  );

  // Calcula o valor total da compra
  readonly valorTotal = computed(() =>
    this.itensSignal().reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  );

  // Recupera os produtos salvos no navegador
  private carregarCarrinho(): ItemCarrinho[] {
    try {
      const dados = localStorage.getItem(this.chaveStorage);

      return dados ? JSON.parse(dados) : [];
    } catch (erro) {
      console.error('Erro ao carregar carrinho:', erro);
      return [];
    }
  }

  // Salva o estado atual do carrinho no navegador
  private salvarCarrinho(): void {
    localStorage.setItem(
      this.chaveStorage,
      JSON.stringify(this.itensSignal())
    );
  }

  // Adiciona um produto ao carrinho
  adicionarProduto(
    produto: ProdutoCarrinho,
    quantidade: number = 1
  ): void {

    // Impede adicionar quantidades inválidas
    if (
      !Number.isInteger(quantidade) ||
      quantidade < 1 ||
      produto.estoque < 1
    ) {
      return;
    }

    const itensAtuais = this.itensSignal();

    // Verifica se o produto já está no carrinho
    const itemExistente = itensAtuais.find(
      item => item.id === produto.id
    );

    if (itemExistente) {

      // Soma a quantidade sem ultrapassar o estoque
      const novaQuantidade = Math.min(
        itemExistente.quantidade + quantidade,
        produto.estoque
      );

      this.itensSignal.update(itens =>
        itens.map(item =>
          item.id === produto.id
            ? {
                ...item,
                ...produto,
                quantidade: novaQuantidade
              }
            : item
        )
      );

    } else {

      // Adiciona um novo produto ao carrinho
      const novoItem: ItemCarrinho = {
        ...produto,
        quantidade: Math.min(quantidade, produto.estoque)
      };

      this.itensSignal.update(itens => [
        ...itens,
        novoItem
      ]);
    }

    // Salva as alterações
    this.salvarCarrinho();
  }

  // Altera a quantidade de um produto no carrinho
  alterarQuantidade(id: number, quantidade: number): void {

    if (!Number.isInteger(quantidade)) {
      return;
    }

    this.itensSignal.update(itens =>
      itens.map(item => {

        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          quantidade: Math.max(
            1,
            Math.min(quantidade, item.estoque)
          )
        };
      })
    );

    this.salvarCarrinho();
  }

  // Remove um produto específico do carrinho
  removerProduto(id: number): void {
    this.itensSignal.update(itens =>
      itens.filter(item => item.id !== id)
    );

    this.salvarCarrinho();
  }

  // Remove todos os produtos do carrinho
  limparCarrinho(): void {
    this.itensSignal.set([]);
    this.salvarCarrinho();
  }
}
