import { Component, inject, signal } from '@angular/core';
import { CourseService, Course } from './course.service';
import { MatIconModule } from '@angular/material/icon';
import { CourseModal } from './course-modal';

import { ImgFallbackDirective } from './img-fallback.directive';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [MatIconModule, CourseModal, ImgFallbackDirective],
  template: `
    <div class="min-h-screen pt-32 pb-20 bg-theme-main transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 fade-in">
          <div class="space-y-4">
            <div class="inline-flex items-center px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-brand-primary/20">
              Catálogo Completo
            </div>
            <h1 class="text-5xl font-bold text-theme-main tracking-tight">Impulsa tu <span class="text-brand-primary italic">Carrera</span></h1>
            <p class="text-lg text-theme-muted max-w-xl">Descubre los cursos especializados diseñados para llevar tus habilidades técnicas al siguiente nivel.</p>
          </div>
          <div class="relative w-full md:w-96 group">
            <input type="text" 
                   #searchInput
                   (input)="onSearch(searchInput.value)"
                   placeholder="¿Qué quieres aprender hoy?" 
                   class="w-full pl-12 pr-6 py-4 bg-theme-surface border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all shadow-sm group-hover:shadow-md font-medium text-theme-main">
            <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-brand-primary transition-colors">search</mat-icon>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          @for (course of filteredCourses(); track course.id) {
            <div class="pro-card group flex flex-col h-full bg-theme-surface border border-theme hover:shadow-brand-primary/20 transition-all duration-500">
              <div class="relative aspect-video overflow-hidden">
                <img [src]="course.image" [alt]="course.title" 
                     appImgFallback
                     class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[2s]"
                     referrerpolicy="no-referrer">
                <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-brand-primary/95 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-lg uppercase tracking-widest">
                    {{ course.category }}
                  </span>
                </div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                   <div class="flex items-center gap-1">
                      <mat-icon class="!text-sm text-amber-400">star</mat-icon>
                      <span class="text-xs font-bold">4.8</span>
                   </div>
                   <span class="text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">{{ course.difficulty }}</span>
                </div>
              </div>
              <div class="flex-1 p-6 flex flex-col space-y-4">
                <div class="flex items-center gap-2 text-brand-primary font-bold">
                    <mat-icon class="!text-sm">schedule</mat-icon>
                    <span class="text-[10px] uppercase tracking-widest">{{ course.duration }}</span>
                </div>
                <h3 class="text-2xl font-bold text-theme-main group-hover:text-brand-primary transition-colors leading-tight line-clamp-2">
                  {{ course.title }}
                </h3>
                <p class="text-theme-muted text-sm leading-relaxed line-clamp-3 mb-4 font-normal">
                  {{ course.description }}
                </p>
                <div class="pt-6 border-t border-theme mt-auto">
                  <button (click)="openModal(course)" 
                          class="btn-premium w-full !rounded-2xl">
                    Ver Detalles
                    <mat-icon class="!text-lg">arrow_forward</mat-icon>
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-32 text-center fade-in">
              <div class="bg-theme-surface w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-theme-muted border border-theme">
                <mat-icon class="!text-5xl">search_off</mat-icon>
              </div>
              <h3 class="text-2xl font-bold text-theme-main">No encontramos resultados</h3>
              <p class="text-theme-muted font-medium">Prueba buscando con palabras clave diferentes.</p>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Course Modal -->
    @if (selectedCourse()) {
      <app-course-modal [course]="selectedCourse()!" (closeModal)="closeModal()" />
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Courses {
  private courseService = inject(CourseService);
  filteredCourses = this.courseService.filteredCourses;

  selectedCourse = signal<Course | null>(null);

  onSearch(query: string) {
    this.courseService.setSearchQuery(query);
  }

  openModal(course: Course) {
    this.selectedCourse.set(course);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedCourse.set(null);
    document.body.style.overflow = 'auto';
  }
}
