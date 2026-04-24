import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiError } from '@app/models/api-error.model';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private readonly authService = inject(AuthService);

  protected readonly apiMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected submit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.apiMessage.set(null);
    this.isSubmitting.set(true);

    this.authService.login(this.loginForm.getRawValue()).pipe(
      finalize(() => this.isSubmitting.set(false)),
    ).subscribe({
      error: (error: ApiError) => {
        this.apiMessage.set(error.message);
      },
    });
  }
}
