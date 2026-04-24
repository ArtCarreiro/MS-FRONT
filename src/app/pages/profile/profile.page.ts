import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionService } from '@app/services/session.service';

@Component({
  selector: 'app-profile-page',
  imports: [AsyncPipe],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
})
export class ProfilePage {
  private readonly sessionService = inject(SessionService);

  protected readonly session$ = this.sessionService.session$;
}
