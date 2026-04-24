import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'app-admin-page',
  imports: [AsyncPipe],
  templateUrl: './admin.page.html',
  styleUrl: './admin.page.css',
})
export class AdminPage {
  private readonly productService = inject(ProductService);

  protected readonly metrics$ = this.productService.list().pipe(
    map((products) => [
      { label: 'Produtos ativos', value: products.length.toString() },
      { label: 'Estoque agregado', value: products.reduce((total, product) => total + product.estoque, 0).toString() },
      { label: 'Integracoes prontas', value: 'Products, Users, Customers, Address' },
    ]),
    catchError(() => of([
      { label: 'Produtos ativos', value: '--' },
      { label: 'Estoque agregado', value: '--' },
      { label: 'Integracoes prontas', value: 'Products, Users, Customers, Address' },
    ])),
  );

  protected readonly nextSteps = [
    'Adicionar CRUD de produtos para administracao',
    'Ligar dashboard a contratos de pedidos e categorias',
    'Expor login/JWT na MS-API para completar governanca de acessos',
  ];
}
