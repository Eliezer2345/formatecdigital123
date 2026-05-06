import { Component, signal, PLATFORM_ID, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <footer class="bg-brand-dark text-white pt-24 pb-12 overflow-hidden relative">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <!-- Platform Identity -->
          <div class="lg:col-span-1 space-y-8">
            <div class="flex items-center space-x-3">
              <div class="bg-brand-primary p-2 rounded-xl">
                <mat-icon class="text-white !text-2xl flex items-center justify-center">school</mat-icon>
              </div>
              <span class="text-2xl font-bold tracking-tight">
                <span class="rainbow-text">{{ platformName().split(' ')[0] }}</span> <span class="text-brand-primary">{{ platformName().split(' ')[1] || '' }}</span>
              </span>
            </div>
            <p class="text-slate-400 font-medium leading-relaxed">
              Empoderando a la próxima generación de profesionales digitales con educación de calidad, práctica y accesible.
            </p>
            <div class="flex space-x-4">
              @for (social of socials; track social.icon) {
                <a [href]="social.link" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <mat-icon class="!text-xl">{{ social.icon }}</mat-icon>
                </a>
              }
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-8">
            <h4 class="text-lg font-bold tracking-tight">Recursos Educativos</h4>
            <ul class="space-y-4 text-slate-400 font-medium text-sm">
              <li><a routerLink="/courses" class="hover:text-brand-primary transition-colors">Catálogo de Cursos</a></li>
              <li><a routerLink="/blog" class="hover:text-brand-primary transition-colors">Blog y Actualización</a></li>
              <li><a routerLink="/diplomas" class="hover:text-brand-primary transition-colors">Verificación de Diplomas</a></li>
              <li><a href="#" class="hover:text-brand-primary transition-colors">Material Gratuito</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-8">
            <h4 class="text-lg font-bold tracking-tight">Soporte y Ayuda</h4>
            <ul class="space-y-4 text-slate-400 font-medium text-sm">
              <li><a routerLink="/about-us" class="hover:text-brand-primary transition-colors">Sobre Nosotros</a></li>
              <li><a routerLink="/contact" class="hover:text-brand-primary transition-colors">Centro de Contacto</a></li>
              <li><a href="#" class="hover:text-brand-primary transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" class="hover:text-brand-primary transition-colors">Métodos de Pago</a></li>
              <li><a href="#" class="hover:text-brand-primary transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="space-y-8">
            <h4 class="text-lg font-bold tracking-tight">Boletín Informativo</h4>
            <p class="text-sm text-slate-400 font-medium">Suscríbete para recibir noticias sobre nuevos cursos y becas.</p>
            <div class="relative">
              <input type="email" placeholder="tu@email.com" 
                     class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-brand-primary outline-none placeholder:text-slate-600 transition-all">
              <button class="absolute right-2 top-2 p-2 bg-brand-primary rounded-xl hover:bg-brand-primary/80 transition-all">
                <mat-icon class="!text-sm flex items-center justify-center">arrow_forward</mat-icon>
              </button>
            </div>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Respetamos tu privacidad al 100%.</p>
          </div>
        </div>

        <!-- Base Footer -->
        <div class="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            © {{ year }} {{ platformName() }}. Todos los derechos reservados.
          </p>
          <div class="flex items-center space-x-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" class="hover:text-white transition-colors">Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Legal</a>
            <a href="#" class="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  platformName = signal('Formatec Digital');
  year = new Date().getFullYear();
  private platformId = inject(PLATFORM_ID);
  
socials = [
  { icon: 'facebook', link: '#' },
  { icon: 'alternate_email', link: '#' },
  { 
    icon: 'camera_alt', 
    link: 'https://www.instagram.com/formatec_digital2?igsh=bG84bWQ0dTk1dXg4&utm_source=qr' 
  },
  { icon: 'play_circle', link: '#' }
];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedName = localStorage.getItem('formatec_name');
      if (savedName) this.platformName.set(savedName);
    }
  }
}
