import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-theme-main transition-colors duration-500 mt-16">
      <div class="max-w-md w-full space-y-8 bg-theme-surface p-10 rounded-3xl shadow-xl border border-theme">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
            <mat-icon class="!text-3xl">person_add</mat-icon>
          </div>
          <h2 class="text-3xl font-extrabold text-theme-main tracking-tight">Crea tu cuenta</h2>
          <p class="mt-2 text-sm text-theme-muted">
            Únete a Formatec Digital y comienza a aprender.
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          @if (error()) {
            <div class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-bold">
              {{ error() }}
            </div>
          }
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-bold text-theme-main mb-1">Nombre completo</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-theme-muted !text-xl">person</mat-icon>
                </div>
                <input id="name" formControlName="name" type="text" required
                       class="block w-full pl-10 pr-3 py-3 border border-theme rounded-xl leading-5 bg-theme-main placeholder-theme-muted text-theme-main focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm transition-all"
                       placeholder="Juan Pérez">
              </div>
              @if (f['name'].touched && f['name'].errors) {
                <p class="mt-1 text-xs text-red-500">El nombre es obligatorio.</p>
              }
            </div>

            <div>
              <label for="email" class="block text-sm font-bold text-theme-main mb-1">Correo electrónico</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-theme-muted !text-xl">email</mat-icon>
                </div>
                <input id="email" formControlName="email" type="email" required
                       class="block w-full pl-10 pr-3 py-3 border border-theme rounded-xl leading-5 bg-theme-main placeholder-theme-muted text-theme-main focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm transition-all"
                       placeholder="juan@ejemplo.com">
              </div>
              @if (f['email'].touched && f['email'].errors) {
                <p class="mt-1 text-xs text-red-600">Ingresa un correo válido.</p>
              }
            </div>

            <div>
              <label for="password" class="block text-sm font-bold text-theme-main mb-1">Contraseña</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-theme-muted !text-xl">lock</mat-icon>
                </div>
                <input id="password" formControlName="password" [type]="showPassword() ? 'text' : 'password'" required
                       class="block w-full pl-10 pr-10 py-3 border border-theme rounded-xl leading-5 bg-theme-main placeholder-theme-muted text-theme-main focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm transition-all"
                       placeholder="••••••••">
                <button type="button" (click)="showPassword.set(!showPassword())" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-brand-primary transition-colors">
                  <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (f['password'].touched && f['password'].errors) {
                <p class="mt-1 text-xs text-red-600">La contraseña debe tener al menos 6 caracteres.</p>
              }
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-bold text-theme-main mb-1">Confirmar contraseña</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <mat-icon class="text-theme-muted !text-xl">lock_reset</mat-icon>
                </div>
                <input id="confirmPassword" formControlName="confirmPassword" [type]="showConfirmPassword() ? 'text' : 'password'" required
                       class="block w-full pl-10 pr-10 py-3 border border-theme rounded-xl leading-5 bg-theme-main placeholder-theme-muted text-theme-main focus:outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm transition-all"
                       placeholder="••••••••">
                <button type="button" (click)="showConfirmPassword.set(!showConfirmPassword())" 
                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-muted hover:text-brand-primary transition-colors">
                  <mat-icon>{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (f['confirmPassword'].touched && registerForm.errors?.['mismatch']) {
                <p class="mt-1 text-xs text-red-600">Las contraseñas no coinciden.</p>
              }
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid"
                    class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/30">
              Registrarse
              <mat-icon class="ml-2 !text-xl">arrow_forward</mat-icon>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private notification = inject(NotificationService);

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  error = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      try {
        this.auth.register({ name: name!, email: email!, password: password!, role: 'user', id: 0 });
        this.auth.completeLogin(email!);
        
        // Send real welcome email (simulated if no keys)
        await this.notification.sendWelcomeEmail(name!, email!);
        
        this.router.navigate(['/profile']);
      } catch (e: unknown) {
        this.error.set(e instanceof Error ? e.message : 'Error al registrar usuario');
      }
    }
  }
}
