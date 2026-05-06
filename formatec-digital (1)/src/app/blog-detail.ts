import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BlogService, BlogPost } from './blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [MatIconModule, RouterLink],
  template: `
    @if (post()) {
      <div class="min-h-screen bg-white pt-32 pb-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 fade-in">
          <!-- Breadcrumbs -->
          <nav class="flex items-center text-[10px] font-bold text-slate-400 space-x-2 uppercase tracking-widest">
            <a routerLink="/blog" class="hover:text-brand-primary transition-colors">Blog</a>
            <mat-icon class="!text-[10px]">chevron_right</mat-icon>
            <span class="text-brand-dark truncate max-w-[200px]">{{ post()?.title }}</span>
          </nav>

          <!-- Hero Section -->
          <header class="space-y-8">
            <div class="space-y-6">
              <div class="inline-flex px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-xl uppercase tracking-widest border border-brand-primary/20">
                {{ post()?.category }}
              </div>
              <h1 class="text-4xl sm:text-6xl font-bold text-brand-dark leading-[1.1] tracking-tight">
                {{ post()?.title }}
              </h1>
              <div class="flex flex-wrap items-center text-[10px] font-bold text-slate-400 gap-6 pt-4 uppercase tracking-widest">
                <div class="flex items-center">
                  <mat-icon class="mr-2 !text-lg text-brand-primary">calendar_today</mat-icon>
                  {{ post()?.date }}
                </div>
                <div class="flex items-center">
                  <mat-icon class="mr-2 !text-lg text-brand-primary">schedule</mat-icon>
                  {{ post()?.readTime }}
                </div>
              </div>
            </div>
            
            <div class="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group">
              <img [src]="post()?.image" [alt]="post()?.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerpolicy="no-referrer">
            </div>
          </header>

          <!-- Article Content -->
          <article class="space-y-24">
            <!-- Introduction -->
            <div class="bg-brand-bg rounded-[3rem] p-10 md:p-16 border border-slate-100 relative overflow-hidden">
               <mat-icon class="absolute -top-4 -right-4 !text-[160px] text-brand-primary opacity-5">format_quote</mat-icon>
               <h3 class="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center">
                Introducción del Especialista
              </h3>
              <p class="text-slate-600 text-2xl md:text-3xl font-medium leading-[1.4] tracking-tight">
                {{ post()?.content?.introduction }}
              </p>
            </div>

            <!-- Main Sections -->
            <div class="space-y-24">
              @for (section of post()?.content?.sections; track section.title) {
                <section class="space-y-10 group">
                  <div class="space-y-4">
                    <div class="w-12 h-1.5 bg-brand-primary rounded-full group-hover:w-24 transition-all duration-700"></div>
                    <h2 class="text-3xl md:text-5xl font-black text-brand-dark tracking-tight">{{ section.title }}</h2>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="text-lg md:text-xl text-slate-600 leading-[1.8] font-medium order-2 lg:order-1">
                      {{ section.text }}
                    </div>
                    @if (section.image) {
                      <div class="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white order-1 lg:order-2">
                        <img [src]="section.image" [alt]="section.title" class="w-full h-48 lg:h-80 object-cover" referrerpolicy="no-referrer">
                      </div>
                    }
                  </div>
                </section>
              }
            </div>

            <!-- Professional Insights Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
               <!-- Tips -->
               <div class="bg-emerald-50 rounded-[3rem] p-12 space-y-8 border border-emerald-100/50">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <mat-icon class="!text-2xl">tips_and_updates</mat-icon>
                    </div>
                    <h3 class="text-2xl font-black text-emerald-900 tracking-tight">Consejos Pro</h3>
                  </div>
                  <ul class="space-y-5">
                    @for (tip of post()?.content?.tips; track tip) {
                      <li class="flex items-start text-emerald-800/80 font-medium leading-relaxed">
                        <mat-icon class="mr-3 text-emerald-500 shrink-0">check_circle</mat-icon>
                        {{ tip }}
                      </li>
                    }
                  </ul>
               </div>

               <!-- Common Errors -->
               <div class="bg-rose-50 rounded-[3rem] p-12 space-y-8 border border-rose-100/50">
                  <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                      <mat-icon class="!text-2xl">dangerous</mat-icon>
                    </div>
                    <h3 class="text-2xl font-black text-rose-900 tracking-tight">Errores Comunes</h3>
                  </div>
                  <ul class="space-y-5">
                    @for (error of post()?.content?.commonErrors; track error) {
                      <li class="flex items-start text-rose-800/80 font-medium leading-relaxed">
                        <mat-icon class="mr-3 text-rose-400 shrink-0">cancel</mat-icon>
                        {{ error }}
                      </li>
                    }
                  </ul>
               </div>
            </div>

            <!-- Tools & Job Market -->
            <div class="space-y-12">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6">
                    <h3 class="text-xl font-black text-brand-dark uppercase tracking-widest flex items-center">
                      <mat-icon class="mr-3 text-brand-primary">construction</mat-icon> Herramientas
                    </h3>
                    <div class="flex flex-wrap gap-3">
                      @for (tool of post()?.content?.tools; track tool) {
                        <span class="px-5 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-sm rounded-full tracking-tight">
                          {{ tool }}
                        </span>
                      }
                    </div>
                  </div>

                  <div class="p-12 bg-brand-primary/5 border border-brand-primary/10 rounded-[3rem] space-y-6">
                    <h3 class="text-xl font-black text-brand-primary uppercase tracking-widest flex items-center">
                      <mat-icon class="mr-3">work_outline</mat-icon> Salidas Laborales
                    </h3>
                    <p class="text-slate-600 font-medium leading-relaxed">
                      {{ post()?.content?.jobMarket }}
                    </p>
                  </div>
               </div>
            </div>

            <!-- Practical Lab -->
            <div class="bg-brand-dark rounded-[4rem] p-10 sm:p-20 text-white space-y-12 shadow-3xl relative overflow-hidden group">
               <div class="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse"></div>
               
               <div class="relative z-10 space-y-10">
                  <div class="inline-flex items-center px-6 py-2 bg-brand-primary text-white text-xs font-black rounded-2xl uppercase tracking-[0.3em]">
                     Laboratorio de Aplicación
                  </div>
                  <div class="space-y-6">
                    <h2 class="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                      Tu Turno de <span class="text-brand-primary italic">Practicar</span>
                    </h2>
                    <p class="text-slate-300 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl">
                      {{ post()?.content?.practicalActivity }}
                    </p>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    @for (q of post()?.content?.reflectionQuestions; track q) {
                      <div class="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-primary/30 transition-all group/card">
                        <mat-icon class="mb-4 text-brand-primary !text-3xl group-hover/card:scale-110 transition-transform"> Psychology_alt </mat-icon>
                        <p class="text-slate-200 text-lg font-medium leading-relaxed">{{ q }}</p>
                      </div>
                    }
                  </div>
               </div>
            </div>
          </article>

          <!-- Footer Actions -->
          <footer class="pt-16 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
            <a routerLink="/blog" class="flex items-center text-slate-400 hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest transition-colors">
              <mat-icon class="mr-3 !text-lg">arrow_back</mat-icon>
              Volver al Listado
            </a>
            <a [routerLink]="['/course-content', post()?.courseId]" class="btn-premium !w-auto !px-10 !py-5 !text-base">
              Explorar Curso Relacionado
              <mat-icon class="ml-2">school</mat-icon>
            </a>
          </footer>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center min-h-screen bg-brand-bg space-y-6 fade-in">
        <div class="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm animate-pulse">
           <mat-icon class="!text-3xl">article</mat-icon>
        </div>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Sincronizando información...</p>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.8s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class BlogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  
  post = signal<BlogPost | undefined>(undefined);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.post.set(this.blogService.getPostById(id));
    });
  }
}
