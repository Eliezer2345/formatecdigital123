import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type LoginMode = 'login' | 'forgot' | 'verify-code' | 'new-password' | 'success';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  template: `
    <div class="login-container min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-brand-dark">
      <!-- Animated Background Circles -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1920&auto=format&fit=crop" 
             class="w-full h-full object-cover opacity-20 grayscale brightness-50" 
             alt="Background">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark/95 to-transparent"></div>
      </div>

      <div class="max-w-md w-full space-y-8 bg-theme-surface/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-3xl border border-white/10 relative z-10 transition-all hover:bg-theme-surface/90">
        
        <!-- HEADER -->
        <div class="text-center">
          @if (auth.lockoutRemaining() > 0 && mode() === 'login') {
            <div class="mx-auto h-20 w-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 animate-bounce">
              <mat-icon class="!text-4xl">timer_off</mat-icon>
            </div>

            <h2 class="text-3xl font-black text-red-600 dark:text-red-400 tracking-tight">
              Acceso Bloqueado
            </h2>

            <p class="mt-4 text-theme-muted font-medium">
              Demasiados intentos fallidos. Por seguridad, espera:
            </p>

            <div class="mt-6 text-6xl font-black text-theme-main tabular-nums">
              {{ auth.lockoutRemaining() }}s
            </div>
          } @else {
            <div class="mx-auto h-20 w-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 transition-all">
              <mat-icon class="!text-4xl">
                @if (mode() === 'login') {
                  lock
                } @else if (mode() === 'forgot') {
                  help
                } @else if (mode() === 'verify-code') {
                  pin
                } @else if (mode() === 'new-password') {
                  password
                } @else {
                  check_circle
                }
              </mat-icon>
            </div>

            <h2 class="text-3xl font-black text-theme-main tracking-tighter leading-tight">
              @if (mode() === 'login') {
                Inicia Sesión
              } @else if (mode() === 'forgot') {
                Recuperar Contraseña
              } @else if (mode() === 'verify-code') {
                Verificar Código
              } @else if (mode() === 'new-password') {
                Nueva Contraseña
              } @else {
                Contraseña Actualizada
              }
            </h2>

            <p class="mt-3 text-sm text-theme-muted font-medium max-w-[300px] mx-auto">
              @if (mode() === 'login') {
                Tu puerta de entrada al conocimiento digital.
              } @else if (mode() === 'forgot') {
                Ingresa tu correo para generar un código de recuperación.
              } @else if (mode() === 'verify-code') {
                Introduce el código de 6 dígitos para continuar.
              } @else if (mode() === 'new-password') {
                Crea una nueva contraseña segura para tu cuenta.
              } @else {
                Ya puedes iniciar sesión con tu nueva contraseña.
              }
            </p>
          }
        </div>

        <!-- LOGIN -->
        @if (mode() === 'login' && auth.lockoutRemaining() === 0) {
          <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onLogin()">
            
            <div class="space-y-5">
              <div class="space-y-1">
                <label for="email" class="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-4">
                  Email Académico
                </label>

                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">
                    alternate_email
                  </mat-icon>

                  <input 
                    id="email" 
                    formControlName="email" 
                    type="email" 
                    required
                    class="block w-full pl-12 pr-4 py-4 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium text-theme-main">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-4">
                  Contraseña
                </label>

                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">
                    key
                  </mat-icon>

                  <input 
                    id="password" 
                    formControlName="password" 
                    [type]="showPassword() ? 'text' : 'password'" 
                    required
                    class="block w-full pl-12 pr-12 py-4 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium text-theme-main">

                  <button 
                    type="button" 
                    (click)="showPassword.set(!showPassword())" 
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-theme-muted hover:text-brand-primary transition-colors">
                    <mat-icon>
                      {{ showPassword() ? 'visibility_off' : 'visibility' }}
                    </mat-icon>
                  </button>
                </div>
              </div>
            </div>

            @if (error()) {
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                <mat-icon class="!text-lg">error_outline</mat-icon>
                <p class="text-xs font-black uppercase tracking-widest">
                  {{ error() }}
                </p>
              </div>
            }

            <button 
              type="submit" 
              [disabled]="loginForm.invalid"
              class="w-full flex justify-center py-5 px-4 bg-brand-primary text-white text-sm font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/10 disabled:opacity-50 active:scale-95 uppercase tracking-widest">
              Identificarse
              <mat-icon class="ml-2 !text-lg">arrow_forward</mat-icon>
            </button>

            <button 
              type="button"
              (click)="goToForgotPassword()"
              class="w-full text-center text-xs font-black text-theme-muted hover:text-brand-primary transition-colors uppercase tracking-widest">
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        }

        <!-- FORGOT PASSWORD -->
        @if (mode() === 'forgot') {
          <form class="mt-8 space-y-6" [formGroup]="recoverForm" (ngSubmit)="sendRecoveryCode()">
            
            <div class="space-y-1">
              <label for="recover-email" class="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-4">
                Correo de Recuperación
              </label>

              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">
                  mail
                </mat-icon>

                <input 
                  id="recover-email" 
                  formControlName="email" 
                  type="email"
                  class="block w-full pl-12 pr-4 py-4 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium text-theme-main">
              </div>
            </div>

            @if (error()) {
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400">
                <mat-icon class="!text-lg">error_outline</mat-icon>
                <p class="text-xs font-black uppercase tracking-widest">
                  {{ error() }}
                </p>
              </div>
            }

            <button 
              type="submit" 
              [disabled]="recoverForm.invalid"
              class="w-full flex justify-center py-5 px-4 bg-brand-primary text-white text-sm font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/10 disabled:opacity-50 active:scale-95 uppercase tracking-widest">
              Enviar Código
              <mat-icon class="ml-2 !text-lg">send</mat-icon>
            </button>

            <button 
              type="button"
              (click)="backToLogin()"
              class="w-full py-4 text-xs font-black text-theme-muted hover:text-brand-primary transition-colors uppercase tracking-widest">
              Volver al Login
            </button>
          </form>
        }

        <!-- VERIFY CODE -->
        @if (mode() === 'verify-code') {
          <form class="mt-8 space-y-6" [formGroup]="verifyCodeForm" (ngSubmit)="verifyRecoveryCode()">

            <div class="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-800 text-center space-y-2">
              <p class="text-xs font-black text-brand-primary uppercase tracking-widest">
                Código de Recuperación
              </p>
              <p class="text-[10px] text-theme-muted font-medium">
                Simulado para pruebas:
                <span class="font-black text-theme-main">{{ recoveryCode() }}</span>
              </p>
              <p class="text-[10px] text-theme-muted">
                Expira en 10 minutos.
              </p>
            </div>

            <div class="relative">
              <input 
                id="recovery-code" 
                formControlName="code" 
                type="text" 
                maxlength="6"
                class="block w-full px-6 py-5 bg-theme-surface border-2 border-theme rounded-[2rem] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all text-center text-4xl font-black tracking-[0.5em] text-brand-primary tabular-nums">
            </div>

            @if (error()) {
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400">
                <mat-icon class="!text-lg">warning</mat-icon>
                <p class="text-xs font-black uppercase tracking-widest">
                  {{ error() }}
                </p>
              </div>
            }

            <button 
              type="submit" 
              [disabled]="verifyCodeForm.invalid"
              class="w-full flex justify-center py-5 px-4 bg-emerald-600 text-white text-sm font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 active:scale-95 uppercase tracking-widest">
              Verificar Código
            </button>

            <button 
              type="button"
              (click)="goToForgotPassword()"
              class="w-full py-4 text-xs font-black text-theme-muted hover:text-brand-primary transition-colors uppercase tracking-widest">
              Solicitar otro código
            </button>
          </form>
        }

        <!-- NEW PASSWORD -->
        @if (mode() === 'new-password') {
          <form class="mt-8 space-y-6" [formGroup]="newPasswordForm" (ngSubmit)="saveNewPassword()">

            <div class="space-y-5">
              <div class="space-y-1">
                <label for="new-password" class="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-4">
                  Nueva Contraseña
                </label>

                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">
                    lock_reset
                  </mat-icon>

                  <input 
                    id="new-password"
                    formControlName="password"
                    [type]="showNewPassword() ? 'text' : 'password'"
                    class="block w-full pl-12 pr-12 py-4 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium text-theme-main">

                  <button 
                    type="button" 
                    (click)="showNewPassword.set(!showNewPassword())" 
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-theme-muted hover:text-brand-primary transition-colors">
                    <mat-icon>
                      {{ showNewPassword() ? 'visibility_off' : 'visibility' }}
                    </mat-icon>
                  </button>
                </div>
              </div>

              <div class="space-y-1">
                <label for="confirm-password" class="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-4">
                  Confirmar Contraseña
                </label>

                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">
                    verified_user
                  </mat-icon>

                  <input 
                    id="confirm-password"
                    formControlName="confirmPassword"
                    [type]="showNewPassword() ? 'text' : 'password'"
                    class="block w-full pl-12 pr-4 py-4 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all font-medium text-theme-main">
                </div>
              </div>
            </div>

            @if (error()) {
              <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400">
                <mat-icon class="!text-lg">error_outline</mat-icon>
                <p class="text-xs font-black uppercase tracking-widest">
                  {{ error() }}
                </p>
              </div>
            }

            <button 
              type="submit"
              [disabled]="newPasswordForm.invalid"
              class="w-full flex justify-center py-5 px-4 bg-brand-primary text-white text-sm font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/10 disabled:opacity-50 active:scale-95 uppercase tracking-widest">
              Guardar Nueva Contraseña
              <mat-icon class="ml-2 !text-lg">save</mat-icon>
            </button>
          </form>
        }

        <!-- SUCCESS -->
        @if (mode() === 'success') {
          <div class="mt-8 space-y-6">
            <div class="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] border border-emerald-100 dark:border-emerald-800 text-center">
              <mat-icon class="!text-5xl text-emerald-500 mb-3">check_circle</mat-icon>
              <p class="text-sm font-bold text-theme-main">
                Tu contraseña fue actualizada correctamente.
              </p>
            </div>

            <button 
              type="button"
              (click)="backToLogin()"
              class="w-full flex justify-center py-5 px-4 bg-brand-primary text-white text-sm font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/10 active:scale-95 uppercase tracking-widest">
              Ir al Login
            </button>
          </div>
        }

      </div>
    </div>
  `,
})
export class Login {
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  mode = signal<LoginMode>('login');
  error = signal<string | null>(null);
  showPassword = signal(false);
  showNewPassword = signal(false);

  recoveryCode = signal<string | null>(null);
  recoveryEmail = signal<string | null>(null);
  recoveryExpiresAt = signal<number>(0);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  recoverForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  verifyCodeForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  newPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  onLogin() {
    const { email, password } = this.loginForm.value;

    const code = this.auth.login(email!, password!);

    if (code) {
      const verified = this.auth.verifyCode(email!, code);

      if (verified) {
        this.error.set(null);

        const user = this.auth.user();

        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      } else {
        this.error.set('No se pudo iniciar sesión.');
      }

    } else {
      this.error.set('Credenciales incorrectas.');
    }
  }

  goToForgotPassword() {
    this.error.set(null);

    const currentEmail = this.loginForm.value.email || '';
    this.recoverForm.patchValue({ email: currentEmail });

    this.mode.set('forgot');
  }

  backToLogin() {
    this.error.set(null);
    this.mode.set('login');

    this.verifyCodeForm.reset();
    this.newPasswordForm.reset();
  }

  sendRecoveryCode() {
    if (this.recoverForm.invalid) return;

    const email = this.recoverForm.value.email!;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    this.recoveryEmail.set(email);
    this.recoveryCode.set(code);
    this.recoveryExpiresAt.set(Date.now() + 10 * 60 * 1000);

    this.error.set(null);
    this.mode.set('verify-code');
  }

  verifyRecoveryCode() {
    if (this.verifyCodeForm.invalid) return;

    const enteredCode = this.verifyCodeForm.value.code;

    if (Date.now() > this.recoveryExpiresAt()) {
      this.error.set('El código ha expirado. Solicita uno nuevo.');
      return;
    }

    if (enteredCode !== this.recoveryCode()) {
      this.error.set('Código incorrecto.');
      return;
    }

    this.error.set(null);
    this.mode.set('new-password');
  }

  saveNewPassword() {
    if (this.newPasswordForm.invalid) return;

    const password = this.newPasswordForm.value.password!;
    const confirmPassword = this.newPasswordForm.value.confirmPassword!;

    if (password !== confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    const email = this.recoveryEmail();

    if (!email) {
      this.error.set('No hay correo de recuperación válido.');
      return;
    }

    const updated = this.updateUserPassword(email, password);

    if (!updated) {
      this.error.set('No se pudo actualizar la contraseña. Verifica que el correo exista.');
      return;
    }

    this.error.set(null);
    this.mode.set('success');

    this.recoveryCode.set(null);
    this.recoveryEmail.set(null);
    this.recoveryExpiresAt.set(0);
  }

  private updateUserPassword(email: string, newPassword: string): boolean {
    const authAny = this.auth as any;

    /*
      Si tu AuthService tiene algún método real de reset,
      este componente lo usará automáticamente.
    */
    if (typeof authAny.resetPassword === 'function') {
      return !!authAny.resetPassword(email, newPassword);
    }

    if (typeof authAny.updatePassword === 'function') {
      return !!authAny.updatePassword(email, newPassword);
    }

    if (typeof authAny.changePasswordByEmail === 'function') {
      return !!authAny.changePasswordByEmail(email, newPassword);
    }

    /*
      Fallback: intenta actualizar usuarios guardados en localStorage.
      Esto cubre estructuras comunes de apps demo/locales.
    */
    if (!isPlatformBrowser(this.platformId)) return false;

    const possibleKeys = [
      'formatec_users',
      'users',
      'auth_users',
      'registered_users',
      'formatec_auth_users',
      'formatec_registered_users'
    ];

    for (const key of possibleKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const data = JSON.parse(raw);

        // Caso 1: array de usuarios
        if (Array.isArray(data)) {
          let found = false;

          const updatedUsers = data.map((user: any) => {
            if (user?.email?.toLowerCase() === email.toLowerCase()) {
              found = true;
              return {
                ...user,
                password: newPassword
              };
            }
            return user;
          });

          if (found) {
            localStorage.setItem(key, JSON.stringify(updatedUsers));
            return true;
          }
        }

        // Caso 2: objeto con propiedad users
        if (data?.users && Array.isArray(data.users)) {
          let found = false;

          data.users = data.users.map((user: any) => {
            if (user?.email?.toLowerCase() === email.toLowerCase()) {
              found = true;
              return {
                ...user,
                password: newPassword
              };
            }
            return user;
          });

          if (found) {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
          }
        }

        // Caso 3: objeto indexado por email
        if (data[email]) {
          data[email] = {
            ...data[email],
            password: newPassword
          };

          localStorage.setItem(key, JSON.stringify(data));
          return true;
        }

      } catch {
        continue;
      }
    }

    return false;
  }
}