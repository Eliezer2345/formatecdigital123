import { Component } from '@angular/core';
import { CourseCarousel } from './course-carousel';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CourseCarousel, RouterLink, MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen pb-24 overflow-x-hidden">
      <!-- Hero Section -->
      <section class="relative h-[85vh] flex items-center overflow-hidden bg-brand-dark">
        <!-- Background Image with Overlay -->
        <div class="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop" 
               alt="Hero Background" 
               class="w-full h-full object-cover opacity-30 active:scale-105 transition-transform duration-[10s]"
               referrerpolicy="no-referrer">
          <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div class="max-w-2xl space-y-8 fade-in">
            <div class="inline-flex items-center px-4 py-2 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/30">
              🚀 Formación Digital de Vanguardia
            </div>
            <h1 class="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Domina las habilidades del <span class="text-brand-primary">futuro hoy.</span>
            </h1>
            <p class="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              La plataforma educativa líder para profesionales que buscan transformar su carrera con cursos prácticos, certificados y avalados por expertos.
            </p>
            <div class="flex flex-wrap gap-4 pt-4">
              <a routerLink="/courses" class="btn-premium px-10 py-4 text-lg">
                Explorar Cursos
                <mat-icon>explore</mat-icon>
              </a>
              <a routerLink="/register" class="btn-secondary px-10 py-4 text-lg bg-transparent border-white/20 text-white hover:bg-white/10">
                Crear Cuenta Gratis
              </a>
            </div>
            
            <div class="flex items-center gap-8 pt-8 border-t border-white/10">
              <div>
                <p class="text-3xl font-bold text-white"></p>
                <p class="text-sm text-slate-500 font-medium uppercase tracking-wider"></p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white"></p>
                <p class="text-sm text-slate-500 font-medium uppercase tracking-wider"></p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white"></p>
                <p class="text-sm text-slate-500 font-medium uppercase tracking-wider"></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative element -->
        <div class="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block bg-gradient-to-l from-brand-primary/10 to-transparent blur-3xl"></div>
      </section>

      <!-- Stats / Partners -->
      <div class="py-16 bg-theme-surface border-y border-theme">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-12 opacity-60">
           <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png" alt="Partner" class="h-10 transition-all hover:opacity-100 hover:grayscale-0 grayscale">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Logo.svg/1024px-Google_Logo.svg.png" alt="Partner" class="h-8 transition-all hover:opacity-100 hover:grayscale-0 grayscale">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/1024px-LinkedIn_Logo.svg.png" alt="Partner" class="h-8 transition-all hover:opacity-100 hover:grayscale-0 grayscale">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png" alt="Partner" class="h-8 transition-all hover:opacity-100 hover:grayscale-0 grayscale">
        </div>
      </div>

      <!-- Main Action Cards -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-4xl font-bold text-brand-dark">¿Qué quieres lograr hoy?</h2>
          <p class="text-slate-500 max-w-xl mx-auto text-lg">Elige el camino que mejor se adapte a tus metas profesionales.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (card of actionCards; track card.title) {
            <a [routerLink]="card.link" 
               class="pro-card group p-8 flex flex-col items-center text-center space-y-6 hover:shadow-brand-primary/20">
              <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:scale-110 group-hover:rotate-6">
                <mat-icon class="!text-4xl">{{ card.icon }}</mat-icon>
              </div>
              <div class="space-y-3">
                <h3 class="text-2xl font-bold text-brand-dark">{{ card.title }}</h3>
                <p class="text-slate-500 leading-relaxed font-normal">
                  {{ card.description }}
                </p>
              </div>
              <div class="pt-4 mt-auto">
                <span class="inline-flex items-center text-brand-primary font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                  Explorar <mat-icon class="!text-xl">arrow_forward</mat-icon>
                </span>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Carousel Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="mb-10 flex items-center justify-between">
          <h2 class="text-3xl font-bold text-brand-dark">Noticias y Actualidad</h2>
          <a routerLink="/blog" class="text-brand-primary font-semibold hover:underline">Ver todo el blog</a>
        </div>
        <div class="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
          <app-course-carousel />
        </div>
      </section>

      <!-- Featured Cursos (Preview) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div class="space-y-4">
            <h2 class="text-4xl font-bold text-brand-dark leading-tight">Cursos <span class="text-brand-primary text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Destacados</span></h2>
            <p class="text-slate-500 text-lg max-w-xl">Aprende las habilidades técnicas más demandadas hoy mismo con nuestros cursos PRO.</p>
          </div>
          <a routerLink="/courses" class="btn-premium whitespace-nowrap">Ver Catálogo Completo</a>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           <!-- Featured course skeletons or real data if I had a computed list here -->
           <!-- I will just use a hardcoded list for now as I can't easily get the full service computation here without more logic -->
           @for (course of featuredCourses; track course.id) {
             <a [routerLink]="['/courses']" class="pro-card group hover:shadow-brand-primary/20 transition-all duration-500">
                <div class="relative aspect-video overflow-hidden">
                  <img [src]="course.image" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[2s]" referrerpolicy="no-referrer">
                  <div class="absolute top-4 left-4">
                    <span class="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-widest text-brand-dark shadow-sm">
                      {{ course.category }}
                    </span>
                  </div>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center gap-2 text-brand-primary">
                    <mat-icon class="!text-sm flex items-center justify-center">bolt</mat-icon>
                    <span class="text-[10px] font-bold uppercase tracking-widest">{{ course.level }}</span>
                  </div>
                  <h3 class="text-xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors line-clamp-1">{{ course.title }}</h3>
                  <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span class="text-sm font-medium text-slate-500">{{ course.duration }}</span>
                    <button class="text-brand-primary group-hover:translate-x-1 transition-transform">
                      <mat-icon>play_circle</mat-icon>
                    </button>
                  </div>
                </div>
             </a>
           }
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-brand-dark rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-3xl">
          <div class="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">¿Listo para dar el siguiente paso en tu carrera?</h2>
          <p class="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">Únete a miles de estudiantes que ya están transformando su futuro con Formatec Digital.</p>
          <div class="flex flex-wrap justify-center gap-6 pt-4">
            <a routerLink="/register" class="btn-premium px-12 py-5 text-xl">Comenzar Ahora</a>
            <a routerLink="/contact" class="btn-secondary px-12 py-5 text-xl bg-white/5 border-white/10 text-white">Contactar</a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class Home {
  actionCards = [
    {
      title: 'Cursos Pro',
      description: 'Explora nuestro catálogo completo de formación técnica especializada.',
      icon: 'school',
      link: '/courses'
    },
    {
      title: 'Diplomas Reales',
      description: 'Certifica tus conocimientos y destaca en el mercado laboral.',
      icon: 'workspace_premium',
      link: '/diplomas'
    },
    {
      title: 'Blog Exclusivo',
      description: 'Artículos y guías de expertos para complementar tu estudio.',
      icon: 'auto_stories',
      link: '/blog'
    }
  ];

  featuredCourses = [
    {
      id: 1,
      title: 'Informática Básica',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      category: 'Tecnología',
      duration: '40 horas',
      level: 'Básico'
    },
    {
      id: 2,
      title: 'Barbería Profesional',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
      category: 'Belleza',
      duration: '60 horas',
      level: 'Básico'
    },
    {
      id: 3,
      title: 'Repostería Creativa',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
      category: 'Cocina',
      duration: '60 horas',
      level: 'Básico'
    },
    {
      id: 5,
      title: 'Auxiliar de Enfermería',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
      category: 'Salud',
      duration: '120 horas',
      level: 'Intermedio'
    }
  ];
}
