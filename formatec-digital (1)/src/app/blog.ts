import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-bg pt-32 pb-20 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <!-- Header -->
        <header class="text-center space-y-6 fade-in max-w-3xl mx-auto">
          <div class="inline-flex items-center px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-xl border border-brand-primary/20">
            Nuestro Blog
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-brand-dark tracking-tight leading-tight">Explora el conocimiento <span class="text-brand-primary italic">actualizado.</span></h1>
          <p class="text-xl text-slate-500 font-medium leading-relaxed">
            Consejos, guías detalladas y recursos estratégicos para potenciar tu crecimiento profesional en Formatec Digital.
          </p>
        </header>

        <!-- Blog Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          @for (post of posts(); track post.id) {
            <article class="pro-card group bg-white flex flex-col h-full animate-in slide-in-from-bottom-5 duration-700 border border-slate-100 hover:shadow-brand-primary/20 transition-all" [style.animation-delay]="($index * 100) + 'ms'">
              <div class="h-60 overflow-hidden relative">
                <img [src]="post.image" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[2s]" referrerpolicy="no-referrer">
                <div class="absolute top-4 right-4">
                  <span class="px-3 py-1 bg-white/95 backdrop-blur-sm text-brand-primary text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-widest border border-slate-100">
                    {{ post.category }}
                  </span>
                </div>
              </div>
              <div class="p-8 flex-1 flex flex-col">
                <div class="flex items-center text-[10px] font-bold text-slate-400 mb-5 space-x-5 uppercase tracking-widest">
                  <span class="flex items-center">
                    <mat-icon class="!text-sm mr-2 text-brand-primary">calendar_today</mat-icon>
                    {{ post.date }}
                  </span>
                  <span class="flex items-center">
                    <mat-icon class="!text-sm mr-2 text-brand-primary">schedule</mat-icon>
                    {{ post.readTime }}
                  </span>
                </div>
                <h2 class="text-2xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">{{ post.title }}</h2>
                <p class="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3 font-medium">{{ post.excerpt }}</p>
                <div class="pt-6 border-t border-slate-50">
                   <a [routerLink]="['/blog', post.id]" class="inline-flex items-center text-brand-primary font-bold text-sm tracking-tight hover:gap-3 transition-all duration-300">
                    Continuar leyendo
                    <mat-icon class="ml-1 !text-xl">arrow_forward</mat-icon>
                  </a>
                </div>
              </div>
            </article>
          }
        </div>

        <!-- Featured Section -->
        <section class="bg-brand-dark rounded-[3.5rem] p-8 sm:p-20 text-white overflow-hidden relative group shadow-2xl">
          <!-- Background Decor -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
             <div class="absolute top-0 right-0 h-[500px] w-[500px] bg-brand-primary/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
             <div class="absolute bottom-0 left-0 h-[400px] w-[400px] bg-emerald-500/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>
          </div>

          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="space-y-8">
              <div class="inline-flex items-center px-4 py-1.5 bg-brand-primary text-white text-[10px] font-bold rounded-xl uppercase tracking-widest">
                Destacado del Mes
              </div>
              <h2 class="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight">Cómo aprender informática educativa desde cero: Guía 2025</h2>
              <p class="text-slate-400 text-lg leading-relaxed font-medium">
                Descubre los pilares fundamentales para dominar la tecnología educativa, desde el hardware básico hasta la creación de contenidos interactivos con impacto real.
              </p>
              <div class="flex flex-wrap gap-3">
                @for (tag of ['Tecnología', 'Educación', 'Nivel Cero']; track tag) {
                   <span class="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      #{{ tag }}
                   </span>
                }
              </div>
              <a [routerLink]="['/blog', 1]" class="btn-premium !w-auto !px-12 !py-5 !text-lg !rounded-2xl">
                Descubrir metodología
                <mat-icon>trending_up</mat-icon>
              </a>
            </div>
            <div class="relative lg:block hidden">
              <div class="absolute -inset-4 bg-brand-primary/20 blur-2xl rounded-3xl group-hover:opacity-40 transition-opacity"></div>
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" 
                   alt="Informática" 
                   class="relative rounded-3xl shadow-2xl skew-y-3 group-hover:skew-y-0 transition-all duration-1000 border border-white/10"
                   referrerpolicy="no-referrer">
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-slide-up {
      opacity: 0;
      animation: slideUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Blog {
  private blogService = inject(BlogService);
  posts = this.blogService.getPosts();
}
