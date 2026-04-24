import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MAIN_NAV_LINKS } from '@app/shared/constants/navigation-links';
import { CartService } from '@app/services/cart.service';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  protected readonly cartItemsCount$ = this.cartService.totalItems$;
  protected readonly navigationLinks = MAIN_NAV_LINKS;
  protected readonly session$ = this.sessionService.session$;
  protected searchTerm = '';

  protected submitSearch(): void {
    const query = this.searchTerm.trim();

    void this.router.navigate(['/products'], {
      queryParams: query ? { q: query } : {},
    });
  }

  protected logout(): void {
    this.sessionService.clearSession();
    void this.router.navigate(['/']);
  }
}
