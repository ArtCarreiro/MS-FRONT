import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '@app/models/api-error.model';
import { RegisterRequest } from '@app/models/auth.model';
import { UserRole } from '@app/models/user-role.model';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly apiMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly roleOptions: { label: string; value: UserRole }[] = [
    { label: 'Cliente', value: 'CUSTOMER' },
    { label: 'Vendedor', value: 'SELLER' },
    { label: 'Administrador', value: 'ADMINISTRATOR' },
  ];

  protected readonly registerForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    role: new FormControl<UserRole>('CUSTOMER', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }, { validators: passwordsMatchValidator });

  protected submit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    const payload: RegisterRequest = {
      email: this.registerForm.controls.email.getRawValue(),
      password: this.registerForm.controls.password.getRawValue(),
      role: this.registerForm.controls.role.getRawValue(),
    };

    this.apiMessage.set(null);
    this.isSubmitting.set(true);

    this.authService.register(payload).pipe(
      finalize(() => this.isSubmitting.set(false)),
    ).subscribe({
      next: () => {
        this.apiMessage.set('Cadastro enviado para a MS-API. Voce ja pode seguir para a tela de login.');
        void this.router.navigate(['/login']);
      },
      error: (error: ApiError) => {
        this.apiMessage.set(error.message);
      },
    });
  }
}

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}
