import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExamService, Exam, Question } from './exam.service';
import { CourseService } from './course.service';
import { animate, stagger } from 'motion';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-brand-bg pt-24 pb-20 transition-colors duration-500">
      <div class="max-w-4xl mx-auto px-4">
        
        @if (exam()) {
          <!-- Header -->
          <header class="mb-10 text-center sm:text-left transition-all duration-700">
            <p class="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-2">Examen {{ exam()?.level }}</p>
            <h1 class="text-3xl font-bold text-brand-dark flex items-center justify-center sm:justify-start">
              {{ exam()?.title }}
            </h1>
            <div class="h-1 w-20 bg-brand-primary/20 rounded-full mt-4 mx-auto sm:mx-0"></div>
          </header>

          @if (!showResult()) {
            <!-- Exam Content -->
            <form [formGroup]="examForm" (ngSubmit)="onSubmit()" class="space-y-6 overflow-hidden">
              @for (question of exam()?.questions; track question.id; let i = $index) {
                <div class="question-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 transition-all hover:border-brand-primary/20 group">
                  <div class="mb-6">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pregunta {{ i + 1 }}</p>
                    <h3 class="text-lg font-bold text-brand-dark leading-snug">{{ question.text }}</h3>
                  </div>

                  <div class="space-y-3">
                    @for (option of question.options; track option.id) {
                      <label 
                        class="flex items-center p-4 rounded-xl border border-slate-100 cursor-pointer transition-all hover:bg-slate-50"
                        [class.bg-brand-primary/5]="examForm.get(question.id.toString())?.value === option.id"
                        [class.border-brand-primary/40]="examForm.get(question.id.toString())?.value === option.id"
                      >
                        <div class="relative flex items-center justify-center h-5 w-5 rounded-full border-2 border-slate-200 mr-4 shrink-0 transition-colors"
                             [class.border-brand-primary]="examForm.get(question.id.toString())?.value === option.id"
                             [class.bg-brand-primary]="examForm.get(question.id.toString())?.value === option.id">
                          @if (examForm.get(question.id.toString())?.value === option.id) {
                            <div class="h-2 w-2 bg-white rounded-full"></div>
                          }
                        </div>
                        <span class="text-sm font-medium text-slate-600 transition-colors"
                              [class.text-brand-dark]="examForm.get(question.id.toString())?.value === option.id"
                              [class.font-bold]="examForm.get(question.id.toString())?.value === option.id">
                          {{ option.text }}
                        </span>
                        <input type="radio" 
                               [value]="option.id" 
                               [formControlName]="question.id.toString()"
                               class="hidden">
                      </label>
                    }
                  </div>
                </div>
              }

              <!-- Submit Button -->
              <div class="flex justify-center pt-8">
                <button type="submit" 
                        [disabled]="examForm.invalid"
                        class="btn-premium px-12 !py-5 text-base shadow-xl min-w-[240px]">
                  <span>{{ examForm.invalid ? 'Complete todas las preguntas' : 'Enviar Examen' }}</span>
                  <mat-icon class="ml-2">check_circle</mat-icon>
                </button>
              </div>
            </form>
          } @else {
            <!-- Results Screen -->
            <div id="results-screen" class="bg-white rounded-[2.5rem] shadow-2xl p-10 sm:p-20 text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 border border-slate-100">
              <div class="relative inline-block">
                <div class="h-40 w-40 rounded-full border-8 mx-auto flex items-center justify-center transition-all duration-1000"
                     [style.border-color]="isPassed() ? '#10b981' : '#ef4444'">
                  <span class="text-5xl font-black italic tracking-tighter"
                        [style.color]="isPassed() ? '#10b981' : '#ef4444'">
                    {{ score() }}%
                  </span>
                </div>
                <div class="absolute -top-4 -right-4 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
                     [class.bg-emerald-500]="isPassed()"
                     [class.bg-red-500]="!isPassed()">
                  <mat-icon class="text-white">
                    {{ isPassed() ? 'emoji_events' : 'error' }}
                  </mat-icon>
                </div>
              </div>

              <div class="space-y-4">
                <h2 class="text-3xl font-black text-brand-dark">
                  {{ isPassed() ? '¡FELICIDADES!' : 'Sigue intentándolo' }}
                </h2>
                <p class="text-slate-500 font-medium max-w-sm mx-auto">
                  {{ isPassed() ? 
                    'Has superado este nivel satisfactoriamente. Tu certificado de este módulo está listo.' : 
                    'No has alcanzado la puntuación mínima (70%). Revisa el contenido nuevamente y vuelve a intentarlo.' }}
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                @if (isPassed()) {
                  <button [routerLink]="['/course-content', exam()?.courseId]" 
                          class="btn-premium px-10">
                    Continuar Curso
                  </button>
                } @else {
                  <button (click)="resetExam()" class="btn-premium px-10">
                    Repetir Examen
                  </button>
                  <button [routerLink]="['/course-content', exam()?.courseId]" 
                          class="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                    Volver al Curso
                  </button>
                }
              </div>
            </div>
          }
        } @else {
          <div class="text-center py-40">
            <mat-icon class="!text-6xl text-slate-200 mb-4">quiz</mat-icon>
            <p class="text-slate-400 font-medium">El examen solicitado no está disponible.</p>
            <button routerLink="/courses" class="mt-6 text-brand-primary font-bold hover:underline">Ver catálogo</button>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ExamComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examService = inject(ExamService);
  private courseService = inject(CourseService);

  exam = signal<Exam | undefined>(undefined);
  examForm = new FormGroup({});
  showResult = signal(false);
  score = signal(0);
  isPassed = computed(() => this.score() >= 70);

  constructor() {
    this.route.params.subscribe(params => {
      const courseId = Number(params['courseId']);
      const level = Number(params['level']);
      const foundExam = this.examService.getExam(courseId, level);
      
      if (foundExam) {
        this.exam.set(foundExam);
        this.initForm(foundExam.questions);
        
        // Stagger questions entrance
        setTimeout(() => {
          const cards = document.querySelectorAll('.question-card');
          if (cards.length > 0) {
            animate(
              cards,
              { opacity: [0, 1], y: [20, 0] },
              { delay: stagger(0.1), duration: 0.8, ease: "easeOut" }
            );
          }
        }, 100);
      }
    });
  }

  initForm(questions: Question[]) {
    const controls: Record<string, FormControl> = {};
    questions.forEach(q => {
      controls[q.id.toString()] = new FormControl('', { nonNullable: true, validators: [Validators.required] });
    });
    this.examForm = new FormGroup(controls);
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    let correctCount = 0;
    const questions = this.exam()?.questions || [];
    
    questions.forEach(q => {
      const userAnswer = this.examForm.get(q.id.toString())?.value;
      if (userAnswer === q.correctOptionId) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    this.score.set(finalScore);
    this.showResult.set(true);

    // If passed, update progress
    if (finalScore >= 70 && this.exam()) {
      const currentExam = this.exam()!;
      // Pass the actual score (normalized to 10.0 scale for certificate if needed, or 100 scale)
      const normalizedScore = Number((finalScore / 10).toFixed(1));
      this.courseService.completeLesson(currentExam.courseId, currentExam.level * 1000, normalizedScore);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetExam() {
    this.showResult.set(false);
    this.score.set(0);
    this.examForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
