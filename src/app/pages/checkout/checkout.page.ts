import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '@app/services/cart.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-checkout-page',
  imports: [AsyncPipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.css',
})
export class CheckoutPage {
  private readonly cartService = inject(CartService);
  private readonly sessionService = inject(SessionService);

  protected readonly checkoutForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl(this.sessionService.snapshot?.user.email ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    document: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    neighborhood: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('Brasil', { nonNullable: true, validators: [Validators.required] }),
    complement: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    paymentMethod: new FormControl<'pix' | 'credit-card' | 'boleto'>('pix', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly cart$ = this.cartService.cart$;
  protected readonly feedbackMessage = signal<string | null>(null);
  protected readonly subtotal$ = this.cartService.subtotal$;

  protected submitOrder(): void {
    this.checkoutForm.markAllAsTouched();

    if (this.checkoutForm.invalid) {
      return;
    }

    if (this.cartService.snapshot.items.length === 0) {
      this.feedbackMessage.set('Adicione itens ao carrinho antes de finalizar o checkout.');
      return;
    }

    this.feedbackMessage.set(
      'Fluxo de checkout estruturado. Integracao de pedidos e pagamento pode apontar para a MS-API assim que os endpoints forem publicados.',
    );
  }
}
