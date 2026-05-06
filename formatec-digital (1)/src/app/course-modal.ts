import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { Course, CourseService } from './course.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from './auth.service';
import { ImgFallbackDirective } from './img-fallback.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-modal',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, ImgFallbackDirective, RouterLink],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-colors duration-500">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#0d1b2a]/80 backdrop-blur-md" 
           (click)="handleClose()" 
           (keydown.escape)="handleClose()"
           role="button"
           tabindex="0"
           aria-label="Cerrar modal"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-theme-surface w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-3xl animate-in fade-in zoom-in duration-500 border border-theme">
        <button (click)="handleClose()" class="absolute top-6 right-6 p-3 rounded-2xl bg-theme-main hover:bg-theme-surface text-theme-muted transition-all z-10" aria-label="Cerrar">
          <mat-icon>close</mat-icon>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Course Details -->
          <div class="p-10 lg:p-16 bg-theme-main/50">
            <div class="relative h-60 sm:h-72 rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl border-4 border-theme">
              <img [src]="course.image" [alt]="course.title" 
                   appImgFallback
                   class="w-full h-full object-cover" referrerpolicy="no-referrer">
              <div class="absolute top-6 left-6">
                <span class="px-4 py-2 bg-brand-primary text-white text-[10px] font-black rounded-xl shadow-lg uppercase tracking-widest">
                  {{ course.category }}
                </span>
              </div>
            </div>

            <h2 class="text-4xl font-black text-theme-main mb-6 tracking-tight leading-tight">{{ course.title }}</h2>
            <p class="text-theme-muted mb-10 leading-relaxed font-medium text-lg">{{ course.longDescription }}</p>

            <div class="grid grid-cols-2 gap-8">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-brand-primary">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div>
                  <p class="text-[10px] text-theme-muted font-black uppercase tracking-widest">Duración</p>
                  <p class="text-sm font-black text-theme-main">{{ course.duration }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div>
                  <p class="text-[10px] text-theme-muted font-black uppercase tracking-widest">Nivel</p>
                  <p class="text-sm font-black text-theme-main">{{ course.level }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                  <mat-icon>bar_chart</mat-icon>
                </div>
                <div>
                  <p class="text-[10px] text-theme-muted font-black uppercase tracking-widest">Dificultad</p>
                  <p class="text-sm font-black text-theme-main">{{ course.difficulty }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action -->
          <div class="p-10 lg:p-16 bg-theme-surface flex flex-col justify-center items-center text-center space-y-10">
              <div class="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-lg transition-all transform hover:rotate-12 duration-500"
                   [class]="isEnrolled() ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' : 'bg-brand-primary/10 text-brand-primary shadow-brand-primary/20'">
                <mat-icon class="!text-5xl">{{ isEnrolled() ? 'verified' : 'auto_stories' }}</mat-icon>
              </div>
              
              <div class="space-y-4 max-w-sm">
                <h3 class="text-3xl font-black text-theme-main tracking-tight leading-tight">
                   {{ isEnrolled() ? '¡Ya estás inscrito!' : 'Acceso Abierto' }}
                </h3>
                <p class="text-theme-muted font-medium">
                   {{ isEnrolled() ? 'Continúa con tus lecciones y obtén tu certificado oficial.' : 'Inscríbete ahora para comenzar tu formación profesional de manera gratuita.' }}
                </p>
              </div>

              <div class="flex flex-col w-full max-w-sm gap-4">
                @if (!isEnrolled()) {
                  <form [formGroup]="enrollForm" (ngSubmit)="onSubmit()" class="space-y-4 w-full">
                    <div class="space-y-4 text-left">
                      <div class="relative">
                        <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">person</mat-icon>
                        <input formControlName="name" placeholder="Nombre completo" class="w-full pl-12 pr-4 py-4 bg-theme-main border border-theme rounded-2xl outline-none focus:border-brand-primary text-sm font-bold">
                      </div>
                      <div class="relative">
                        <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">mail</mat-icon>
                        <input formControlName="email" placeholder="Email académico" class="w-full pl-12 pr-4 py-4 bg-theme-main border border-theme rounded-2xl outline-none focus:border-brand-primary text-sm font-bold">
                      </div>
                    </div>
                    <button type="submit" [disabled]="enrollForm.invalid"
                            class="w-full py-5 bg-brand-primary text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center group/btn text-lg disabled:opacity-50">
                      Inscribirme Ahora
                      <mat-icon class="ml-3 group-hover/btn:translate-x-1 transition-transform">how_to_reg</mat-icon>
                    </button>
                  </form>
                } @else {
                  <a [routerLink]="['/course-content', course.id]" (click)="closeModal.emit()" 
                     class="w-full py-5 bg-brand-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center group/btn text-lg">
                    Continuar Aprendiendo
                    <mat-icon class="ml-3 group-hover/btn:translate-x-1 transition-transform">play_circle</mat-icon>
                  </a>
                  
                  <div class="flex items-center gap-4">
                    <button (click)="unenroll()" 
                            class="flex-1 py-4 bg-red-500/10 text-red-500 font-black rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center border border-red-500/20 text-sm uppercase tracking-widest">
                      <mat-icon class="mr-2">cancel</mat-icon>
                      Anular Inscripción
                    </button>
                    <button (click)="handleClose()" class="flex-1 py-4 bg-theme-main text-theme-muted font-black rounded-2xl hover:bg-theme-surface border border-theme transition-all text-sm uppercase tracking-widest">
                       Volver
                    </button>
                  </div>
                }
                
                @if (!isEnrolled()) {
                  <button (click)="handleClose()" class="w-full py-4 bg-theme-main text-theme-muted font-black rounded-2xl hover:bg-theme-surface border border-theme transition-all">
                    Explorar otros cursos
                  </button>
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CourseModal implements OnInit {
  @Input({ required: true }) course!: Course;
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  isEnrolled = signal(false);

  enrollForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.enrollForm.patchValue({
        name: user.name,
        email: user.email
      });
      
      // Check if already enrolled
      const enrolledIds = this.courseService.getEnrolledCourses().map(c => c.id);
      if (enrolledIds.includes(this.course.id)) {
        this.isEnrolled.set(true);
      }
    }
  }

  get progress() {
    return this.courseService.getCourseProgress(this.course.id);
  }

  handleClose() {
    if (!this.isEnrolled() && this.enrollForm.dirty) {
      const confirmClose = confirm('Tienes cambios sin guardar en el formulario de inscripción. ¿Estás seguro de que quieres salir?');
      if (!confirmClose) return;
    }
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.enrollForm.valid) {
      this.courseService.enroll(this.course.id);
      this.isEnrolled.set(true);
    }
  }

  unenroll() {
    this.courseService.unenroll(this.course.id);
    this.isEnrolled.set(false);
  }
}
