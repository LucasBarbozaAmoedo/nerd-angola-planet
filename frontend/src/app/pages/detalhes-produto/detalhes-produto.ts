
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { produtos } from '../../data/produtos';

@Component({
  selector: 'app-detalhes-produto',
  imports: [],
  templateUrl: './detalhes-produto.html',
  styleUrl: './detalhes-produto.css',
})
export class DetalhesProduto {
  private rota = inject(ActivatedRoute);

  produto = toSignal(
    this.rota.paramMap.pipe(
      map(params =>
        produtos.find(item => item.id === params.get('id'))
      )
    )
  );
}
