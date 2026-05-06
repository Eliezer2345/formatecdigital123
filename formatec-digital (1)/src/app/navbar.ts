import { FormsModule } from '@angular/forms';
import { Component, inject, signal, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';
import { NotificationService } from './notification.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],

  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 shadow-lg border-b transition-all duration-300 bg-theme-surface border-theme text-theme-main">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-3 group">
           <div 
  (click)="triggerLogoInput()"
  class="bg-brand-primary h-12 w-12 rounded-full overflow-hidden flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-brand-primary/30 relative">

  @if (brandLogo()) {
    <img [src]="brandLogo()" class="h-full w-full object-cover" />
  } @else {
    <mat-icon class="text-white !text-2xl flex items-center justify-center">school</mat-icon>
  }

  <!-- Edit button (solo admin) -->
  @if (auth.user()?.role === 'admin') {
    <button (click)="triggerLogoInput()"
            class="absolute -bottom-1 -right-1 bg-white text-brand-primary p-1 rounded-full shadow-md hover:scale-110 transition-all">
      <mat-icon class="!text-[12px]">edit</mat-icon>
    </button>
  }

</div>

<input type="file"
       #logoInput
       class="hidden"
       accept="image/png, image/jpeg, image/webp"
       (change)="onLogoSelected($event)">
           <div class="relative group/name">

  <span 
    (click)="enableNameEdit()"
    class="text-2xl font-bold tracking-tight hidden sm:block text-theme-main cursor-pointer">

    <span class="rainbow-text">{{ platformName().split(' ')[0] }}</span> 
    <span class="text-brand-primary">{{ platformName().split(' ')[1] || '' }}</span>

  </span>

  @if (editingName()) {
    <div class="absolute top-12 left-0 bg-white shadow-xl rounded-xl p-4 w-64 z-50">
      <input
        type="text"
        [(ngModel)]="tempName"
        class="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="Nuevo nombre de la plataforma">

      <div class="flex justify-end gap-2 mt-3">
        <button (click)="cancelNameEdit()" class="text-sm px-3 py-1">
          Cancelar
        </button>
        <button (click)="savePlatformName()" class="bg-brand-primary text-white text-sm px-3 py-1 rounded">
          Guardar
        </button>
      </div>
    </div>
  }

</div>
            </a>
            
            <div class="hidden lg:ml-10 lg:flex lg:space-x-1">
              <a routerLink="/" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10" 
                 [routerLinkActiveOptions]="{exact: true}"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Inicio
              </a>
              <a routerLink="/courses" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Cursos
              </a>
              <a routerLink="/about-us" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Sobre Nosotros
              </a>
              <a routerLink="/diplomas" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Diplomas
              </a>
              <a routerLink="/blog" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Blog
              </a>
              <a routerLink="/contact" 
                 routerLinkActive="!text-brand-primary bg-brand-primary/10"
                 class="px-4 py-2 rounded-lg text-sm font-bold transition-all text-theme-muted hover:text-brand-primary hover:bg-theme-main">
                Contacto
              </a>
              @if (auth.user()?.role === 'admin') {
                <a routerLink="/admin" 
                   routerLinkActive="!text-white bg-red-600"
                   class="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all border border-red-500/30 ml-2">
                  Admin
                </a>
              }
            </div>
          </div>
          
          <div class="flex items-center space-x-2 sm:space-x-4">
            <!-- Theme Toggle -->
            <button (click)="themeService.toggleTheme()" 
                    class="p-2.5 rounded-xl transition-colors"
                    [class.hover:bg-white/10]="themeService.currentTheme() === 'dark'"
                    [class.hover:bg-slate-100]="themeService.currentTheme() === 'light'"
                    [class.text-slate-300]="themeService.currentTheme() === 'dark'"
                    [class.text-slate-600]="themeService.currentTheme() === 'light'"
                    [class.hover:text-brand-primary]="true"
                    [title]="themeService.currentTheme() === 'light' ? 'Modo Oscuro' : 'Modo Claro'">
              <mat-icon class="!text-xl">{{ themeService.currentTheme() === 'light' ? 'dark_mode' : 'light_mode' }}</mat-icon>
            </button>

            @if (!auth.user()) {
              <a routerLink="/login" 
                 class="text-sm font-medium transition-colors"
                 [class.text-slate-300]="themeService.currentTheme() === 'dark'"
                 [class.text-slate-600]="themeService.currentTheme() === 'light'"
                 [class.hover:text-white]="themeService.currentTheme() === 'dark'"
                 [class.hover:text-brand-dark]="themeService.currentTheme() === 'light'">
                Ingresar
              </a>
              <a routerLink="/register" 
                 class="inline-flex items-center px-4 sm:px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-primary/90 transition-all shadow-md active:scale-95">
                Empezar
              </a>
            } @else {
              <div class="flex items-center space-x-3 group relative">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-semibold leading-none"
                     [class.text-white]="themeService.currentTheme() === 'dark'"
                     [class.text-slate-900]="themeService.currentTheme() === 'light'">{{ auth.user()?.name }}</p>
                  <p class="text-[11px] font-medium mt-1"
                     [class.text-slate-400]="themeService.currentTheme() === 'dark'"
                     [class.text-slate-500]="themeService.currentTheme() === 'light'">{{ auth.user()?.role === 'admin' ? 'Administrador' : 'Estudiante' }}</p>
                </div>
                
                <div class="relative group/profile">
                  <div class="relative">
                    <a routerLink="/profile" 
                       routerLinkActive="ring-2 ring-brand-primary ring-offset-2"
                       [class.ring-offset-brand-dark]="themeService.currentTheme() === 'dark'"
                       [class.ring-offset-white]="themeService.currentTheme() === 'light'"
                       class="flex items-center justify-center h-10 w-10 border-2 rounded-full transition-all overflow-hidden shadow-inner relative z-10"
                       [class.bg-slate-700]="themeService.currentTheme() === 'dark'"
                       [class.bg-slate-100]="themeService.currentTheme() === 'light'"
                       [class.border-white/20]="themeService.currentTheme() === 'dark'"
                       [class.border-slate-200]="themeService.currentTheme() === 'light'">
                      @if (auth.user()?.profileImage) {
                        <img [src]="auth.user()?.profileImage" [alt]="auth.user()?.name" class="h-full w-full object-cover" referrerpolicy="no-referrer">
                      } @else {
                        <mat-icon [class.text-slate-300]="themeService.currentTheme() === 'dark'"
                                  [class.text-slate-400]="themeService.currentTheme() === 'light'"
                                  class="!text-xl">person</mat-icon>
                      }
                    </a>

                    <!-- Image Edit Overlay -->
                    <button (click)="triggerFileInput()" 
                            class="absolute -bottom-1 -right-1 bg-brand-primary text-white p-1 rounded-full shadow-lg z-20 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/profile:opacity-100"
                            title="Cambiar foto de perfil">
                      <mat-icon class="!text-[12px] h-3 w-3 flex items-center justify-center">edit</mat-icon>
                    </button>
                    
                    <input type="file" #fileInput class="hidden" accept="image/png, image/jpeg, image/webp" (change)="onFileSelected($event)">
                  </div>

                  <!-- Dropdown Menu -->
                  <div class="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all duration-300 z-[60] border"
                       [class.bg-dark-surface]="themeService.currentTheme() === 'dark'"
                       [class.bg-white]="themeService.currentTheme() === 'light'"
                       [class.border-dark-border]="themeService.currentTheme() === 'dark'"
                       [class.border-slate-100]="themeService.currentTheme() === 'light'">
                    <div class="px-4 py-3 border-b sm:hidden"
                         [class.border-dark-border]="themeService.currentTheme() === 'dark'"
                         [class.border-slate-100]="themeService.currentTheme() === 'light'">
                       <p class="text-sm font-bold"
                          [class.text-white]="themeService.currentTheme() === 'dark'"
                          [class.text-slate-900]="themeService.currentTheme() === 'light'">{{ auth.user()?.name }}</p>
                       <p class="text-xs"
                          [class.text-slate-400]="themeService.currentTheme() === 'dark'"
                          [class.text-slate-500]="themeService.currentTheme() === 'light'">{{ auth.user()?.email }}</p>
                    </div>
                    <a routerLink="/profile" 
                       class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                       [class.text-slate-300]="themeService.currentTheme() === 'dark'"
                       [class.text-slate-700]="themeService.currentTheme() === 'light'"
                       [class.hover:bg-slate-900/50]="themeService.currentTheme() === 'dark'"
                       [class.hover:bg-slate-50]="themeService.currentTheme() === 'light'">
                      <mat-icon class="mr-3 !text-lg" [class.text-slate-500]="themeService.currentTheme() === 'dark'" [class.text-slate-400]="themeService.currentTheme() === 'light'">person</mat-icon> Mi Perfil
                    </a>
                    <a routerLink="/diplomas" 
                       class="flex items-center px-4 py-2.5 text-sm font-medium transition-colors"
                       [class.text-slate-300]="themeService.currentTheme() === 'dark'"
                       [class.text-slate-700]="themeService.currentTheme() === 'light'"
                       [class.hover:bg-slate-900/50]="themeService.currentTheme() === 'dark'"
                       [class.hover:bg-slate-50]="themeService.currentTheme() === 'light'">
                      <mat-icon class="mr-3 !text-lg" [class.text-slate-500]="themeService.currentTheme() === 'dark'" [class.text-slate-400]="themeService.currentTheme() === 'light'">workspace_premium</mat-icon> Mis Diplomas
                    </a>
                    <div class="h-px my-1"
                         [class.bg-dark-border]="themeService.currentTheme() === 'dark'"
                         [class.bg-slate-100]="themeService.currentTheme() === 'light'"></div>
                    <button (click)="logout()" 
                            class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 transition-colors"
                            [class.hover:bg-red-900/10]="themeService.currentTheme() === 'dark'"
                            [class.hover:bg-red-50]="themeService.currentTheme() === 'light'">
                      <mat-icon class="mr-3 !text-lg text-red-400">logout</mat-icon> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Navbar {

  auth = inject(AuthService);
  themeService = inject(ThemeService);
  notification = inject(NotificationService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  platformName = signal('Formatec Digital');
  editingName = signal(false);
tempName = '';

  // ✅ Logo dinámico
  brandLogo = signal<string | null>(null);

  // ✅ Inputs
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('logoInput') logoInput!: ElementRef<HTMLInputElement>;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {

      const savedName = localStorage.getItem('formatec_name');
      if (savedName) this.platformName.set(savedName);

      const savedLogo = localStorage.getItem('formatec_logo');
      if (savedLogo) this.brandLogo.set(savedLogo);
    }
  }

  /* =========================
     FOTO DE PERFIL USUARIO
  ========================== */

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {

      const file = input.files[0];

      // Tamaño máximo 2MB
      if (file.size > 2 * 1024 * 1024) {
        this.notification.showToast('La imagen no debe superar los 2MB', 'error');
        return;
      }

      // Formatos permitidos
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.notification.showToast('Formato no permitido. Use JPG, PNG o WEBP', 'error');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.auth.uploadProfileImage(base64);
        this.notification.showToast('Foto de perfil actualizada', 'success');
      };

      reader.readAsDataURL(file);
    }
  }

  /* =========================
     LOGO DEL NAVBAR (ADMIN)
  ========================== */

  triggerLogoInput() {
    if (this.auth.user()?.role === 'admin') {
      this.logoInput.nativeElement.click();
    }
  }

  onLogoSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {

      const file = input.files[0];

      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.notification.showToast('El logo no debe superar los 2MB', 'error');
        return;
      }

      // Validar formato
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.notification.showToast('Formato no permitido. Use JPG, PNG o WEBP', 'error');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;

        this.brandLogo.set(base64);

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('formatec_logo', base64);
        }

        this.notification.showToast('Logo actualizado correctamente', 'success');
      };

      reader.readAsDataURL(file);
    }
  }
/* =========================
   CAMBIAR NOMBRE PLATAFORMA
========================= */

enableNameEdit() {
  if (this.auth.user()?.role !== 'admin') return;

  this.tempName = this.platformName();
  this.editingName.set(true);
}

cancelNameEdit() {
  this.editingName.set(false);
}

savePlatformName() {

  if (!this.tempName.trim()) {
    this.notification.showToast('El nombre no puede estar vacío', 'error');
    return;
  }

  this.platformName.set(this.tempName.trim());

  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('formatec_name', this.tempName.trim());
  }

  this.editingName.set(false);

  this.notification.showToast('Nombre actualizado correctamente', 'success');
}
  /* =========================
     LOGOUT
  ========================== */

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}