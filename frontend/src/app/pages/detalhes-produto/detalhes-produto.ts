
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-detalhes-produto',
  imports: [],
  templateUrl: './detalhes-produto.html',
  styleUrl: './detalhes-produto.css',
})
export class DetalhesProduto {
  private rota = inject(ActivatedRoute);

  produtos = [
    {
      id: '1',
      nome: 'Monkey D. Luffy Gear 5',
      categoria: 'One Piece',
      imagem: '/images/luffy.png',
      descricao: 'Figure colecionável do Monkey D. Luffy em sua transformação Gear 5.'
    },
    {
      id: '2',
      nome: 'Satoru Gojo',
      categoria: 'Jujutsu Kaisen',
      imagem: '/images/gojo.png',
      descricao: 'Figure colecionável do Satoru Gojo, de Jujutsu Kaisen.'
    },
    {
      id: '3',
      nome: 'Frieren',
      categoria: 'Frieren e a Jornada para o Além',
      imagem: '/images/frieren.png',
      descricao: 'Figure colecionável da Frieren.'
    }
  ];

  produto = toSignal(
    this.rota.paramMap.pipe(
      map(params =>
        this.produtos.find(item => item.id === params.get('id'))
      )
    )
  );
}
