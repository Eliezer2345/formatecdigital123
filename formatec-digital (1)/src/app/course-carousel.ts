import { Component, signal, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from './img-fallback.directive';

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  imports: [MatIconModule, RouterLink, CommonModule, ImgFallbackDirective],
  template: `
    <div class="relative w-full bg-white dark:bg-dark-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-border h-[500px] md:h-[600px] transition-colors duration-500">
      <!-- Slides Container -->
      <div class="relative h-full">
        @for (slide of slides; track slide.title; let i = $index) {
          <div 
            class="absolute inset-0 flex flex-col md:flex-row items-center transition-all duration-1000 ease-in-out h-full"
            [class.opacity-100]="currentIndex() === i"
            [class.opacity-0]="currentIndex() !== i"
            [class.pointer-events-none]="currentIndex() !== i"
            [class.translate-x-0]="currentIndex() === i"
            [class.translate-x-full]="currentIndex() < i"
            [class.-translate-x-full]="currentIndex() > i"
          >
            <!-- Image Section (Left) -->
            <div class="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
              <img 
                [src]="slide.image" 
                [alt]="slide.title"
                appImgFallback
                class="w-full h-full object-cover transition-transform duration-[2000ms]"
                [class.scale-110]="currentIndex() === i"
                referrerpolicy="no-referrer"
              >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-transparent"></div>
            </div>

            <!-- Text Section (Right) -->
            <div class="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center space-y-6">
              <div class="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-[#0d1b2a] dark:text-white leading-tight">
                  {{ slide.title }}
                </h2>
                <p class="text-lg text-gray-500 dark:text-slate-400 max-w-lg leading-relaxed">
                  {{ slide.description }}
                </p>
                <div class="flex flex-wrap gap-4 pt-4">
                  <a routerLink="/courses" class="px-8 py-4 bg-[#0d6efd] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center group">
                    Curso Nuevo
                    <mat-icon class="ml-2 group-hover:translate-x-1 transition-transform">rocket_launch</mat-icon>
                  </a>
                  <button class="px-8 py-4 bg-gray-100 dark:bg-white/10 text-[#0d1b2a] dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
                    Tecnología
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Indicators (Dots) -->
      <div class="absolute bottom-8 right-8 md:right-16 flex space-x-3 z-30">
        @for (slide of slides; track slide.title; let i = $index) {
          <button 
            (click)="setSlide(i)"
            [aria-label]="'Go to slide ' + (i + 1)"
            class="h-2 rounded-full transition-all duration-500"
            [class.bg-[#0d6efd]]="currentIndex() === i"
            [class.w-8]="currentIndex() === i"
            [class.bg-gray-200]="currentIndex() !== i"
            [class.dark:bg-white/20]="currentIndex() !== i"
            [class.w-2]="currentIndex() !== i"
          ></button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CourseCarousel implements OnDestroy {
  slides = [
    {
      title: 'Diseño Web Profesional',
      description: 'Aprende a crear sitios web modernos y responsivos con las últimas tecnologías del mercado digital.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop'
    },
    {
      title: 'Marketing Digital 360',
      description: 'Domina las estrategias de crecimiento y posicionamiento para marcas en el ecosistema digital actual.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop'
    },
    {
      title: 'Programación Fullstack',
      description: 'Conviértete en un desarrollador completo dominando tanto el frontend como el backend.',
      image: 'https://images.unsplash.com/photo-1581090700227-1e8a5c3e3f4c?q=80&w=1200&auto=format&fit=crop'
    }
  ];
  
  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.intervalId = setInterval(() => {
      this.next();
    }, 5000);
  }

  private stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  next() {
    this.currentIndex.update(i => (i + 1) % this.slides.length);
    this.startAutoSlide();
  }

  prev() {
    this.currentIndex.update(i => (i - 1 + this.slides.length) % this.slides.length);
    this.startAutoSlide();
  }

  setSlide(index: number) {
    this.currentIndex.set(index);
    this.startAutoSlide();
  }
}
