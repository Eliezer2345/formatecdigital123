import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, inject, signal, computed, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { CourseService, Course, Lesson } from './course.service';
import { CourseContentService, CourseDetail, LessonContent, LevelContent } from './course-content.service';
import { NotificationService } from './notification.service';
import { BlogService, BlogPost } from './blog.service';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from './auth.service';
import { AuditService } from './audit.service';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';


@Component({
  selector: 'app-course-content',
  standalone: true,
  imports: [MatIconModule, ReactiveFormsModule, RouterLink, CommonModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row mt-20 relative">
      <!-- Enrollment Overlay/Modal -->
      @if ((!tempAccessGranted() || showEnrollForm()) && authService.user()?.role !== 'admin') {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-500">
          <div class="bg-theme-surface max-w-2xl w-full rounded-[3rem] p-8 md:p-12 text-center space-y-8 shadow-2xl overflow-y-auto max-h-[90vh] relative border border-theme">
            <button (click)="tempAccessGranted() ? showEnrollForm.set(false) : null" 
                    [class.invisible]="!tempAccessGranted()"
                    class="absolute top-8 right-8 p-2 rounded-full hover:bg-theme-main transition-colors text-theme-main">
              <mat-icon>close</mat-icon>
            </button>
            
            <div class="w-24 h-24 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center text-brand-primary mx-auto relative group">
              <div class="absolute inset-0 bg-brand-primary rounded-[2.5rem] animate-ping opacity-20 group-hover:opacity-40"></div>
              <mat-icon class="!text-5xl relative z-10">school</mat-icon>
            </div>
            
            <div class="space-y-4">
              <h2 class="text-4xl md:text-5xl font-black text-theme-main tracking-tighter leading-tight">
                {{ isEnrolled() ? 'Confirmar Inscripción' : 'Inicia tu Camino' }}
              </h2>
              <p class="text-lg text-theme-muted font-medium max-w-sm mx-auto leading-relaxed">
                {{ isEnrolled() ? 'Verifica tus datos para continuar con el acceso completo.' : 'Completa este formulario para inscribirte y desbloquear todo el material.' }}
              </p>
            </div>

            <div class="grid grid-cols-1 gap-6 text-left">
              <div class="space-y-3">
                <label for="enroll-name" class="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] ml-4">Tu Nombre Real</label>
                <div class="relative">
                  <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted">person</mat-icon>
                  <input id="enroll-name" type="text" [(ngModel)]="enrollData.name" placeholder="Ej: Eliezer Martínez" 
                         class="w-full pl-14 pr-6 py-5 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none text-sm font-semibold transition-all text-theme-main">
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="space-y-3">
                    <label for="enroll-email" class="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] ml-4">Correo Electrónico</label>
                    <div class="relative">
                      <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted">mail</mat-icon>
                      <input id="enroll-email" type="email" [(ngModel)]="enrollData.email" placeholder="email@ejemplo.com" 
                             class="w-full pl-14 pr-6 py-5 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none text-sm font-semibold transition-all text-theme-main">
                    </div>
                 </div>
                 <div class="space-y-3">
                    <label for="enroll-phone" class="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] ml-4">WhatsApp / Teléfono</label>
                    <div class="relative">
                      <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-theme-muted">phone</mat-icon>
                      <input id="enroll-phone" type="tel" [(ngModel)]="enrollData.phone" placeholder="+1 (809)..." 
                             class="w-full pl-14 pr-6 py-5 bg-theme-main border border-theme rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none text-sm font-semibold transition-all text-theme-main">
                    </div>
                 </div>
              </div>
            </div>

            <div class="pt-6 space-y-6">
              <button (click)="registerInCourse()" 
                      class="w-full py-6 bg-brand-primary text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] text-xl flex items-center justify-center group active:scale-95">
                Inscribirme Ahora
                <mat-icon class="ml-3 group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
              </button>
              
              <div class="flex items-center justify-center space-x-8 text-slate-400">
                <div class="flex items-center text-[10px] font-black uppercase tracking-widest">
                  <mat-icon class="mr-2 !text-lg text-emerald-500">check_circle</mat-icon>
                  100% Gratis
                </div>
                <div class="flex items-center text-[10px] font-black uppercase tracking-widest">
                  <mat-icon class="mr-2 !text-lg text-brand-primary">workspace_premium</mat-icon>
                  Certificable
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <!-- Left Sidebar: Levels Accordion -->
      <aside class="w-full lg:w-96 bg-brand-dark text-white overflow-y-auto lg:h-[calc(100vh-80px)] sticky top-20 shadow-2xl z-10 scrollbar-hide border-r border-white/5">
        <div class="p-8 border-b border-white/10 bg-white/5">
          <h2 class="text-xl font-bold text-white leading-tight mb-6">{{ course()?.title }}</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Tu progreso</span>
              <span class="text-white">{{ progress() }}%</span>
            </div>
            <div class="bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div class="bg-brand-primary h-full transition-all duration-1000" [style.width.%]="progress()"></div>
            </div>

            @if (progress() === 100) {
              <a routerLink="/diplomas" class="mt-6 flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 text-sm italic group">
                <mat-icon class="group-hover:rotate-12 transition-transform">workspace_premium</mat-icon>
                VER MI CERTIFICADO
              </a>
            }
          </div>
        </div>

        <div class="divide-y divide-white/5">
          @if (courseDetail()) {
            @for (level of courseDetail()?.levels; track level.level) {
              <div class="bg-transparent">
                <button 
                  (click)="toggleLevel(level.level)"
                  class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-all group"
                >
                  <div class="flex items-center text-left">
                    <div class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center mr-4 group-hover:bg-brand-primary transition-colors">
                      <span class="text-[10px] font-bold text-slate-400 group-hover:text-white">{{ level.level }}</span>
                    </div>
                    <span class="font-semibold text-sm tracking-tight text-white/90">Nivel {{ level.level }}</span>
                  </div>
                  <mat-icon class="text-white/20 transition-transform duration-300" [class.rotate-180]="expandedLevels().includes(level.level)">
                    expand_more
                  </mat-icon>
                </button>
                
                @if (expandedLevels().includes(level.level)) {
                  <div class="bg-black/20 py-1">
                    @for (lesson of level.lessons; track lesson.title; let idx = $index) {
                      <button 
                        (click)="selectLessonContent(level.level, lesson)"
                        class="w-full px-8 py-3.5 flex items-center text-sm transition-all border-l-4 group/item relative"
                        [class.bg-brand-primary/10]="currentLessonContent()?.title === lesson.title"
                        [class.text-white]="currentLessonContent()?.title === lesson.title"
                        [class.border-brand-primary]="currentLessonContent()?.title === lesson.title"
                        [class.text-slate-400]="currentLessonContent()?.title !== lesson.title"
                        [class.border-transparent]="currentLessonContent()?.title !== lesson.title"
                        [class.hover:bg-white/5]="currentLessonContent()?.title !== lesson.title"
                        [class.hover:text-white]="currentLessonContent()?.title !== lesson.title"
                      >
                        <mat-icon class="mr-3 !text-lg transition-transform group-hover/item:scale-110" 
                                  [class.text-emerald-400]="isLessonContentCompleted(level.level, lesson)"
                                  [class.text-brand-primary]="!isLessonContentCompleted(level.level, lesson) && currentLessonContent()?.title === lesson.title">
                          {{ (isLessonContentCompleted(level.level, lesson) ? 'check_circle' : 'play_circle') }}
                        </mat-icon>
                        <span class="flex-1 text-left font-medium line-clamp-1">{{ lesson.title }}</span>
                      </button>
                    }
                    
                    @if (level.exam) {
                      <button 
                        (click)="selectLevelExam(level)"
                        class="w-full px-8 py-3.5 flex items-center text-sm transition-all border-l-4 group/item"
                        [class.bg-amber-500/10]="isLevelExamSelected(level)"
                        [class.text-white]="isLevelExamSelected(level)"
                        [class.border-amber-500]="isLevelExamSelected(level)"
                        [class.text-slate-400]="!isLevelExamSelected(level)"
                        [class.border-transparent]="!isLevelExamSelected(level)"
                        [class.hover:bg-white/5]="!isLevelExamSelected(level)"
                        [class.hover:text-white]="!isLevelExamSelected(level)"
                      >
                        <mat-icon class="mr-3 !text-lg transition-transform group-hover/item:scale-110"
                                  [class.text-emerald-400]="isLevelExamCompleted(level.level)"
                                  [class.text-amber-500]="!isLevelExamCompleted(level.level)">
                          {{ isLevelExamCompleted(level.level) ? 'check_circle' : 'quiz' }}
                        </mat-icon>
                        <span class="flex-1 text-left font-medium line-clamp-1 italic">Examen Nivel {{ level.level }}</span>
                      </button>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>
      </aside>

      <!-- Right Main Content: Lesson Player -->
      <main class="flex-1 p-4 sm:p-10 lg:h-[calc(100vh-80px)] overflow-y-auto bg-theme-main">
        <!-- Content Container -->
        @if (currentLessonContent() || currentLevelExam()) {
          <div class="max-w-5xl mx-auto space-y-12 fade-in">
            <!-- Active Lesson Content -->
            @if (currentLessonContent(); as content) {
              <div class="space-y-12 pb-20">
                <div class="space-y-4">
                  <nav class="flex items-center space-x-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4">
                    <a routerLink="/courses" class="hover:underline">Mis Cursos</a>
                    <mat-icon class="!text-[10px]">chevron_right</mat-icon>
                    <span class="truncate max-w-[200px] text-theme-muted">{{ course()?.title }}</span>
                  </nav>
                  <h1 class="text-4xl md:text-7xl font-black text-theme-main tracking-tight leading-[1.05]">{{ content.title }}</h1>
                  
                  <div class="flex flex-wrap items-center gap-4 pt-2">
                    <div class="inline-flex items-center px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-brand-primary/20">
                      <mat-icon class="mr-2 !text-lg">topic</mat-icon>
                      {{ content.topic }}
                    </div>
                      @if (authService.user()?.role === 'admin') {
                        <button (click)="toggleEdit()" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-slate-800 transition-colors">
                           <mat-icon class="mr-2 !text-lg">{{ isEditing() ? 'close' : 'edit' }}</mat-icon>
                           {{ isEditing() ? 'Cancelar' : 'Editar' }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Iframe Video -->
                  @if (content.video) {
                    <div class="relative group">
                      <div class="absolute -inset-1.5 bg-gradient-to-r from-brand-primary to-blue-400 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                      <div class="relative aspect-video bg-black rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-3xl border-8 border-white ring-1 ring-black/5">
                        <iframe [src]="currentVideoUrl()" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                      </div>

                      <!-- Video Customization Field -->
                      <div class="mt-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <div class="flex-1 space-y-1">
                          <h4 class="text-sm font-black text-brand-dark uppercase tracking-widest">Personalizar Video</h4>
                          <p class="text-xs text-slate-500 font-medium tracking-tight">Pega una URL de YouTube para cambiar el video de esta lección.</p>
                        </div>
                        <div class="flex w-full md:w-auto items-center gap-3">
                          <input type="text" 
                                 [(ngModel)]="tempVideoUrl" 
                                 placeholder="https://youtube.com/..." 
                                 class="flex-1 md:w-64 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-primary outline-none">
                          <button (click)="saveCustomVideo(currentLevelNum(), content.title)" 
                                  class="px-5 py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10">
                            Guardar
                          </button>
                        </div>
                      </div>

                      <!-- Always visible Registration CTA -->
                      <div class="mt-12 p-8 md:p-10 bg-gradient-to-br from-brand-primary/10 to-blue-600/10 rounded-[3rem] border border-brand-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
                         <div class="space-y-2 text-center md:text-left">
                            <h3 class="text-2xl font-black text-brand-dark tracking-tight">Registro de Estudiante</h3>
                            <p class="text-slate-500 font-medium max-w-sm">Mantén tus datos actualizados para tu certificación oficial.</p>
                         </div>
                         <button (click)="requestRegistration()" 
                                 class="px-8 py-4 bg-brand-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl flex items-center group">
                            {{ isEnrolled() ? 'Actualizar Mis Datos' : 'Registrarme al Curso' }}
                            <mat-icon class="ml-3 group-hover:translate-x-1 transition-transform">how_to_reg</mat-icon>
                         </button>
                      </div>
                    </div>
                  }

                  <!-- Premium Infographics Design -->
                  @if (content.infographics; as infographics) {
                    <div class="space-y-16 mt-20">
                      <header class="text-center space-y-4 px-4 bg-brand-primary/5 py-12 rounded-[3.5rem] border border-brand-primary/10">
                        <div class="w-16 h-1 w-20 bg-brand-primary mx-auto rounded-full mb-6"></div>
                        <h2 class="text-3xl md:text-5xl font-black text-theme-main tracking-tight">Material de <span class="text-brand-primary italic">Estudio</span> Especializado</h2>
                        <p class="text-theme-muted font-medium max-w-2xl mx-auto text-lg">Visualiza los conceptos clave de esta lección con nuestras infografías técnicas de alta resolución.</p>
                      </header>

                      <div class="grid grid-cols-1 gap-12">
                        @for (info of infographics; track info.title) {
                          <div class="bg-theme-surface rounded-[4rem] overflow-hidden border border-theme shadow-2xl flex flex-col md:flex-row group transition-all duration-700 hover:shadow-brand-primary/5 ring-1 ring-black/[0.02]">
                            <!-- Visual Header Left Side -->
                            <div class="md:w-1/3 bg-brand-dark p-12 text-white relative flex flex-col justify-between overflow-hidden">
                              <div class="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl group-hover:animate-pulse"></div>
                              <mat-icon class="opacity-10 !text-[180px] absolute -bottom-10 -left-10 rotate-12 transition-transform duration-1000 group-hover:-rotate-6">architecture</mat-icon>
                              
                              <div class="relative z-10 space-y-4">
                                <div class="w-12 h-1 bg-brand-primary rounded-full"></div>
                                <h4 class="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-400">Nivel Académico Premium</h4>
                                <h3 class="text-4xl font-black leading-[1.1] text-white">{{ info.title }}</h3>
                              </div>

                              <div class="relative z-10 pt-10">
                                <p class="text-slate-400 text-sm font-medium leading-relaxed italic opacity-80">
                                  "Dominar estos fundamentos es el primer paso hacia la excelencia técnica en {{ course()?.title }}."
                                </p>
                              </div>
                            </div>

                            <!-- Content Right Side -->
                            <div class="flex-1 p-10 md:p-16 space-y-12">
                              <div class="space-y-6">
                                <div class="flex items-center space-x-3">
                                  <div class="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <mat-icon class="text-brand-primary !text-lg">info</mat-icon>
                                  </div>
                                  <h5 class="text-sm font-black text-theme-main uppercase tracking-widest">Resumen del Concepto</h5>
                                </div>
                                <p class="text-xl text-theme-muted font-medium leading-relaxed border-l-4 border-theme pl-8">
                                  {{ info.purpose }}
                                </p>
                              </div>

                              <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                @for (item of info.items; track item.label) {
                                  <div class="flex flex-col p-8 bg-theme-main rounded-[2.5rem] border border-theme hover:border-brand-primary/10 hover:bg-theme-surface hover:shadow-xl transition-all duration-500 group/item">
                                    <div class="w-16 h-16 bg-theme-surface rounded-3xl flex items-center justify-center text-brand-primary shadow-lg shadow-blue-900/5 mb-6 group-hover/item:scale-110 group-hover/item:bg-brand-primary group-hover/item:text-white transition-all border border-theme">
                                      <mat-icon class="!text-3xl">{{ item.icon }}</mat-icon>
                                    </div>
                                    <div class="space-y-3">
                                      <h6 class="font-black text-theme-main text-lg tracking-tight">{{ item.label }}</h6>
                                      <div class="w-8 h-0.5 bg-theme-muted/20 group-hover/item:w-16 transition-all duration-500"></div>
                                      <p class="text-theme-muted text-sm leading-relaxed font-medium">{{ item.detail }}</p>
                                    </div>
                                  </div>
                                }
                              </div>

                              <div class="pt-8 flex flex-wrap items-center gap-6 justify-between border-t border-slate-50">
                                <div class="flex items-center space-x-3">
                                   <div class="flex -space-x-2">
                                     <div class="h-8 w-8 rounded-full border-2 border-white bg-slate-200"></div>
                                     <div class="h-8 w-8 rounded-full border-2 border-white bg-slate-300"></div>
                                     <div class="h-8 w-8 rounded-full border-2 border-white bg-brand-primary flex items-center justify-center text-[10px] text-white font-bold">+1k</div>
                                   </div>
                                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudiantes consultaron esto</span>
                                </div>
                                <div class="flex items-center space-x-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                  <mat-icon class="!text-lg">verified</mat-icon>
                                  <span>Contenido Verificado</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }

                   <!-- Instructor Mini-Blog / Tips -->
                   <div class="mt-32 space-y-12">
                      <div class="flex items-center justify-between">
                         <div class="space-y-2">
                            <h3 class="text-4xl font-black text-theme-main tracking-tighter">Consejos del <span class="text-brand-primary italic">Instructor</span></h3>
                            <p class="text-theme-muted font-medium">Secretos del oficio para potenciar tu carrera.</p>
                         </div>
                         <mat-icon class="!text-6xl text-brand-primary opacity-20">psychology</mat-icon>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         <div class="bg-theme-surface p-10 rounded-[3rem] border border-theme shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                            <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                               <mat-icon class="!text-8xl text-theme-muted">lightbulb</mat-icon>
                            </div>
                            <div class="space-y-6 relative z-10">
                               <span class="px-4 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest">Tip Profesional</span>
                               <h4 class="text-2xl font-black text-theme-main leading-tight">La Regla de los 2 Minutos</h4>
                               <p class="text-theme-muted font-medium leading-relaxed">Si una tarea técnica te toma menos de dos minutos, hazla de inmediato. No la pospongas.</p>
                            </div>
                         </div>

                         <div class="bg-brand-dark p-10 rounded-[3rem] text-white shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                            <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                               <mat-icon class="!text-8xl">history_edu</mat-icon>
                            </div>
                            <div class="space-y-6 relative z-10">
                               <span class="px-4 py-1 bg-white/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">Metodología Formatec</span>
                               <h4 class="text-2xl font-black leading-tight">Documentación Proactiva</h4>
                               <p class="text-slate-300 font-medium leading-relaxed">Documenta tu proceso mientras aprendes. Tu "yo" del futuro te lo agradecerá profundamente.</p>
                            </div>
                         </div>

                         <div class="bg-blue-600 p-10 rounded-[3rem] text-white shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                           <div class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                               <mat-icon class="!text-8xl">groups</mat-icon>
                            </div>
                            <div class="space-y-6 relative z-10">
                               <span class="px-4 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Enfoque Real</span>
                               <h4 class="text-2xl font-black leading-tight">Colaboración Efectiva</h4>
                               <p class="text-blue-100 font-medium leading-relaxed">Nadie trabaja solo en el mundo real. Comparte tus dudas en el foro de estudiantes.</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <!-- Content Sections -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                    <div class="p-8 bg-theme-surface rounded-[2.5rem] border border-theme shadow-sm">
                      <h3 class="text-lg font-black text-brand-primary uppercase tracking-widest mb-4 flex items-center">
                        <mat-icon class="mr-2">target</mat-icon> Propósito
                      </h3>
                      <p class="text-theme-muted leading-relaxed font-medium">{{ content.purpose }}</p>
                    </div>
                    <div class="p-8 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 shadow-sm">
                      <h3 class="text-lg font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center">
                        <mat-icon class="mr-2">warning</mat-icon> Importante
                      </h3>
                      <p class="text-theme-main leading-relaxed font-medium">{{ content.important }}</p>
                    </div>
                  </div>

                  <div class="flex justify-center pt-10 border-t border-theme">
                    @if (isLessonContentCompleted(currentLevelNum(), content)) {
                      <div class="bg-emerald-500/10 text-emerald-500 px-10 py-5 rounded-3xl font-black flex items-center animate-in zoom-in border border-emerald-500/20">
                        <mat-icon class="mr-3">check_circle</mat-icon> ¡Lección Completada!
                      </div>
                    } @else {
                      <button (click)="markAsCompleted()" class="btn-premium !py-6 !px-16 !text-xl !rounded-[2rem]">
                        Completar y Continuar
                        <mat-icon class="ml-2 !text-2xl">chevron_right</mat-icon>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Level Exam View -->
              @if (currentLevelExam(); as exam) {
                <div class="bg-theme-surface rounded-[3rem] p-16 shadow-2xl border border-theme text-center space-y-10 animate-in zoom-in duration-700">
                  <div class="w-32 h-32 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto rotate-12 mb-4">
                    <mat-icon class="!text-6xl">quiz</mat-icon>
                  </div>
                  <div class="space-y-4">
                    <h2 class="text-4xl font-black text-theme-main tracking-tight">Examen Final: Nivel {{ currentLevelNum() }}</h2>
                    <p class="text-theme-muted text-xl font-medium max-w-lg mx-auto">Valida tus competencias y desbloquea el siguiente módulo.</p>
                  </div>
                  <button (click)="selectLevelExam(exam)" class="px-16 py-7 bg-brand-primary text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-brand-primary/30 text-lg">
                    Iniciar Evaluación Ahora
                  </button>
                </div>
              }
            </div>
          }
        @else if (currentLesson()) {
          <div class="max-w-4xl mx-auto space-y-10">
            <h1 class="text-4xl font-black text-theme-main">{{ currentLesson()?.title }}</h1>
            <div class="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
              <iframe [src]="currentVideoUrl()" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="flex justify-center p-10">
               <button (click)="markAsCompleted()" class="btn-premium">Cerrar Lección</button>
            </div>
          </div>
        }
        @else {
          <!-- Default Course Home -->
          <div class="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-700">
             <!-- Mandatory Registration CTA -->
             <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-10 bg-theme-surface rounded-[3rem] border border-theme shadow-xl shadow-brand-primary/5 hover:border-brand-primary/20 transition-all group">
                <div class="space-y-2">
                   <div class="inline-flex items-center space-x-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-2">
                      <mat-icon class="!text-sm">verified</mat-icon>
                      <span>Acceso Oficial</span>
                   </div>
                   <h3 class="text-3xl font-black text-theme-main tracking-tighter">Registrarme a este curso</h3>
                   <p class="text-theme-muted font-medium max-w-sm">Completa tu registro para guardar tu progreso y obtener el certificado oficial.</p>
                </div>
                <button (click)="requestRegistration()" 
                        class="px-10 py-6 bg-brand-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-brand-primary/30 flex items-center justify-center group active:scale-95 text-lg">
                  Inscribirme Ahora
                  <mat-icon class="ml-4 group-hover:scale-125 transition-transform">how_to_reg</mat-icon>
                </button>
             </div>

             <!-- Hero Card -->
             <div class="bg-brand-dark rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div class="space-y-8">
                     <div class="inline-flex px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl">
                        Bienvenido al Curso
                     </div>
                     <h1 class="text-5xl lg:text-7xl font-black tracking-tight leading-[1.05]">{{ course()?.title }}</h1>
                     <p class="text-xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-brand-primary pl-6">
                        {{ courseDetail()?.generalInfo }}
                     </p>
                  </div>
                  <div class="hidden lg:flex justify-center">
                     <div class="w-64 h-64 bg-white/5 rounded-[3.5rem] border border-white/10 flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-1000">
                        <mat-icon class="!text-8xl text-brand-primary">auto_awesome</mat-icon>
                     </div>
                  </div>
                </div>
             </div>

             <!-- Stats Grid -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @for (stat of [
                  { label: 'Tu Progreso', val: progress() + '%', icon: 'trending_up', color: 'text-brand-primary' },
                  { label: 'Lecciones', val: completedLessonsCount() + '/' + totalLessons(), icon: 'school', color: 'text-emerald-500' },
                  { label: 'Certificación', val: 'Digital', icon: 'verified', color: 'text-purple-500' }
                ]; track stat.label) {
                  <div class="bg-theme-surface p-10 rounded-[3rem] border border-theme shadow-sm hover:shadow-xl transition-all">
                    <mat-icon [class]="'!text-4xl mb-4 ' + stat.color">{{ stat.icon }}</mat-icon>
                    <p class="text-xs font-black text-theme-muted uppercase tracking-widest mb-1">{{ stat.label }}</p>
                    <p class="text-4xl font-black text-theme-main tracking-tighter">{{ stat.val }}</p>
                  </div>
                }
             </div>

             <!-- Course Blog -->
             @if (coursePosts().length > 0) {
               <section class="space-y-12">
                  <div class="flex items-end justify-between border-b border-theme pb-8 text-theme-main">
                    <div class="space-y-2">
                       <h3 class="text-4xl font-black tracking-tight">Artículos del Curso</h3>
                       <p class="text-theme-muted font-medium">Contenido extra para ampliar tu visión.</p>
                    </div>
                    <mat-icon class="!text-5xl opacity-20">article</mat-icon>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    @for (post of coursePosts(); track post.id) {
                      <div class="bg-theme-surface rounded-[3rem] border border-theme overflow-hidden shadow-sm hover:shadow-2xl transition-all group h-full flex flex-col">
                        <div class="aspect-video relative overflow-hidden">
                          <img [src]="post.image" [alt]="post.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
                          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div class="absolute bottom-6 left-8">
                            <span class="px-3 py-1 bg-brand-primary text-white text-[9px] font-black rounded-lg uppercase tracking-widest">
                              Guía
                            </span>
                          </div>
                        </div>
                        <div class="p-10 space-y-5 flex-1 flex flex-col">
                           <div class="flex items-center text-[10px] font-bold text-theme-muted uppercase tracking-[0.2em] gap-4">
                              <span>{{ post.date }}</span>
                              <span>•</span>
                              <span>{{ post.category }}</span>
                           </div>
                           <h4 class="text-3xl font-black text-theme-main group-hover:text-brand-primary transition-colors leading-tight">
                              {{ post.title }}
                           </h4>
                           <p class="text-theme-muted font-medium line-clamp-3 leading-relaxed">
                              {{ post.excerpt }}
                           </p>
                           <div class="pt-6 mt-auto">
                             <a [routerLink]="['/blog', post.id]" class="inline-flex items-center px-8 py-3 bg-theme-main text-theme-main text-xs font-black rounded-2xl hover:bg-brand-primary hover:text-white border border-theme transition-all uppercase tracking-widest group/btn">
                                Leer más
                                <mat-icon class="ml-3 !text-lg group-hover/btn:translate-x-2 transition-transform">arrow_forward</mat-icon>
                             </a>
                           </div>
                        </div>
                      </div>
                    }
                  </div>
               </section>
             }
          </div>
        }
      </main>

      <!-- Course Completed Overlay -->
      @if (courseCompleted()) {
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0d1b2a]/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div class="bg-white max-w-md w-full rounded-[3rem] p-12 text-center space-y-8 shadow-2xl animate-in zoom-in duration-500">
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <mat-icon class="!text-5xl">workspace_premium</mat-icon>
            </div>
            <div class="space-y-4">
              <h2 class="text-3xl font-black text-gray-900 leading-tight">¡Felicidades, {{ authService.user()?.name || 'Eliezer' }}!</h2>
              <p class="text-gray-500 text-lg">
                Has completado satisfactoriamente el curso de <span class="font-bold text-blue-600">{{ course()?.title }}</span>.
              </p>
            </div>
            <div class="pt-4 space-y-4">
              <a routerLink="/diplomas" class="block w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                Ver mi Diploma
              </a>
              <button (click)="courseCompleted.set(false)" class="block w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                Seguir explorando
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CourseContent {
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private contentService = inject(CourseContentService);
  private blogService = inject(BlogService);
  private notification = inject(NotificationService);
 
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private auditService = inject(AuditService);
  authService = inject(AuthService);

getSafeVideo(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

  course = signal<Course | undefined>(undefined);
  courseDetail = signal<CourseDetail | undefined>(undefined);
  coursePosts = signal<BlogPost[]>([]);
  currentLesson = signal<Lesson | null>(null);
  currentLessonContent = signal<LessonContent | null>(null);
  currentLevelExam = signal<LevelContent | null>(null);
  currentLevelNum = signal<number>(1);
  expandedLevels = signal<number[]>([1]);
  tempVideoUrl = '';

  currentLessonIndex = computed(() => {
    const detail = this.courseDetail();
    const current = this.currentLessonContent();
    if (!detail || !current) return -1;
    
    // Find absolute index in current level
    const level = detail.levels.find(l => l.level === this.currentLevelNum());
    if (!level) return -1;
    return level.lessons.findIndex(l => l.title === current.title);
  });

  rawVideoUrl = computed(() => {
    const content = this.currentLessonContent();
    const lesson = this.currentLesson();
    let url = 'https://www.youtube.com/embed/rfscVS0vtbw';
    
    if (content) {
      url = this.getEffectiveVideoUrl(content);
    } else if (lesson) {
      url = lesson.content || url;
    }
    
    return url;
  });
  

  currentVideoUrl = signal<SafeResourceUrl>(this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/rfscVS0vtbw'));

  getEffectiveVideoUrl(content: LessonContent): string {
    const courseId = this.course()?.id;
    if (!courseId) return content.video;
    
    if (isPlatformBrowser(this.platformId)) {
      const key = `custom_video_${courseId}_${this.currentLevelNum()}_${content.title}`;
      const userStoredVideo = localStorage.getItem(key);
      if (userStoredVideo) return userStoredVideo;
    }
    return content.video;
  }

  saveCustomVideo(levelNum: number, lessonTitle: string) {
    const course = this.course();
    if (!course || !this.tempVideoUrl) return;
    
    let embedUrl = this.tempVideoUrl;
    // Standard YouTube URL to Embed conversion
    if (this.tempVideoUrl.includes('watch?v=')) {
      embedUrl = this.tempVideoUrl.replace('watch?v=', 'embed/');
    } else if (this.tempVideoUrl.includes('youtu.be/')) {
      const parts = this.tempVideoUrl.split('youtu.be/');
      const videoId = parts[parts.length - 1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (!embedUrl.startsWith('http')) {
      embedUrl = 'https://' + embedUrl;
    }

    if (isPlatformBrowser(this.platformId)) {
      const key = `custom_video_${course.id}_${levelNum}_${lessonTitle}`;
      localStorage.setItem(key, embedUrl);
    }
    
    // Refresh content
    if (this.currentLessonContent()) {
       this.currentLessonContent.set({...this.currentLessonContent()!});
    }
    this.tempVideoUrl = '';
  }

  enrollInCourse() {
    const c = this.course();
    if (c) {
      this.courseService.enroll(c.id);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
  
  // Edit state
  isEditing = signal(false);
  editForm: FormGroup;

  // Video state
  videoLoading = signal(true);
  videoError = signal(false);
  fallbackIndex = signal(0);

  progress = computed(() => {
    const c = this.course();
    return c ? this.courseService.getCourseProgress(c.id) : 0;
  });

  totalLessons = computed(() => {
    const c = this.course();
    if (!c) return 0;
    const detail = this.courseDetail();
    if (detail) {
      return detail.levels.reduce((acc, l) => acc + l.lessons.length + (l.exam ? 1 : 0), 0);
    }
    return c.levels.reduce((acc, l) => acc + l.lessons.length, 0);
  });

  completedLessonsCount = computed(() => {
    const c = this.course();
    if (!c) return 0;
    return this.courseService.completedLessons()[c.id]?.length || 0;
  });

  levelStats = computed(() => {
    const c = this.course();
    const detail = this.courseDetail();
    if (!c || !detail) return [];

    return detail.levels.map(level => {
      const catalogLevel = c.levels.find(l => l.id === level.level);
      if (!catalogLevel) return null;

      const levelLessons = level.lessons.length;
      const levelExam = level.exam ? 1 : 0;
      const levelTotal = levelLessons + levelExam;
      
      let levelCompleted = 0;
      const completedIds = this.courseService.completedLessons()[c.id] || [];
      
      level.lessons.forEach((l, i) => {
        if (completedIds.includes(level.level * 100 + (i + 1))) levelCompleted++;
      });
      if (completedIds.includes(level.level * 1000)) levelCompleted++;

      const percent = levelTotal > 0 ? Math.round((levelCompleted / levelTotal) * 100) : 0;

      return {
        level: level.level,
        title: catalogLevel.title,
        total: levelTotal,
        completed: levelCompleted,
        percent
      };
    }).filter((s): s is NonNullable<typeof s> => s !== null);
  });

  courseCompleted = signal(false);
  isEnrolled = signal(false);
  showEnrollForm = signal(false);
  tempAccessGranted = signal(false);
  
  enrollData = {
    name: '',
    email: '',
    phone: ''
  };

  checkEnrollment() {
    if (isPlatformBrowser(this.platformId)) {
      const courseId = this.course()?.id;
      if (!courseId) return;
      
      // Check both local storage AND CourseService for consistency
      const enrolled = JSON.parse(localStorage.getItem('formatec_enrollments') || '{}');
      const inService = this.courseService.getEnrolledCourses().some(c => c.id === courseId);
      
      this.isEnrolled.set(!!enrolled[courseId] || inService);
      
      if (this.authService.user()?.role === 'admin') {
        this.tempAccessGranted.set(true);
      }
    }
  }

  enrollError = signal('');

  registerInCourse() {
    if (!this.enrollData.name || !this.enrollData.email || !this.enrollData.phone) {
      this.enrollError.set('Por favor complete todos los campos');
      setTimeout(() => this.enrollError.set(''), 3000);
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      const courseId = this.course()?.id;
      if (!courseId) return;
      
      const enrolled = JSON.parse(localStorage.getItem('formatec_enrollments') || '{}');
      enrolled[courseId] = {
        ...this.enrollData,
        date: new Date().toISOString()
      };
      localStorage.setItem('formatec_enrollments', JSON.stringify(enrolled));
      this.isEnrolled.set(true);
      this.tempAccessGranted.set(true);
      this.showEnrollForm.set(false);
      
      // Update global course service to reflect in profile
      this.courseService.enroll(courseId);
      
      this.auditService.log(this.enrollData.name, `Inscripción al curso: ${this.course()?.title}`);
      
      // Send real enrollment confirmation email
      this.notification.sendEnrollmentConfirmation(this.enrollData.name, this.enrollData.email, this.course()?.title || 'Curso');

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });
    }
  }

  requestRegistration() {
    this.tempAccessGranted.set(false);
    this.showEnrollForm.set(true);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  safeVideoUrl(url: string): SafeResourceUrl {
    const currentContent = this.currentLessonContent();
    let finalUrl = url;

    if (this.videoError() && currentContent?.fallbackVideos && currentContent.fallbackVideos.length > 0) {
      const idx = this.fallbackIndex() % currentContent.fallbackVideos.length;
      finalUrl = currentContent.fallbackVideos[idx];
    }

    if (!finalUrl) return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/rfscVS0vtbw');
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  onVideoLoad() {
    this.videoLoading.set(false);
  }

  handleVideoError() {
    this.videoError.set(true);
    this.videoLoading.set(true);
    this.fallbackIndex.update(i => i + 1);
    
    setTimeout(() => {
      this.videoLoading.set(false);
    }, 1500);
  }

  constructor() {
    this.checkEnrollment();
    
    // Stability effect for video URL to prevent infinite reloads
    effect(() => {
      const url = this.rawVideoUrl();
      this.currentVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    });

    this.editForm = this.fb.group({
      video: ['', [Validators.required, this.youtubeEmbedValidator]],
      topic: ['', Validators.required],
      purpose: ['', Validators.required],
      important: ['', Validators.required],
      practice: ['', Validators.required],
      activity: ['', Validators.required],
      reflection: ['', Validators.required],
      fallbackVideos: this.fb.array([])
    });

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.course.set(this.courseService.getCourseById(id));
      this.courseDetail.set(this.contentService.getContentByCourseId(id));
      this.coursePosts.set(this.blogService.getPostsByCourseId(id));
      
      this.currentLessonContent.set(null);
      this.currentLevelExam.set(null);
      this.currentLesson.set(null);
      this.expandedLevels.set([1]);
      this.checkEnrollment();
    });
  }

  toggleLevel(levelId: number) {
    this.expandedLevels.update(ids => 
      ids.includes(levelId) ? ids.filter(id => id !== levelId) : [...ids, levelId]
    );
  }

  selectLesson(levelNum: number, lesson: Lesson) {
    this.currentLevelNum.set(levelNum);
    this.currentLesson.set(lesson);
    this.currentLessonContent.set(null);
    this.currentLevelExam.set(null);
    this.videoLoading.set(true);
    this.videoError.set(false);
    this.fallbackIndex.set(0);
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selectLessonContent(levelNum: number, lesson: LessonContent) {
    this.currentLevelNum.set(levelNum);
    this.currentLessonContent.set(lesson);
    this.currentLesson.set(null);
    this.currentLevelExam.set(null);
    this.videoLoading.set(true);
    this.videoError.set(false);
    this.fallbackIndex.set(0);
    if (isPlatformBrowser(this.platformId) && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selectLevelExam(level: LevelContent) {
    const course = this.course();
    if (course) {
      this.router.navigate(['/exam', course.id, level.level]);
    }
  }

  isLevelExamSelected(level: LevelContent): boolean {
    return this.currentLevelExam()?.level === level.level;
  }

  markAsCompleted() {
    const course = this.course();
    if (!course) return;

    let lessonId: number | null = null;

    if (this.currentLesson()) {
      lessonId = this.currentLesson()!.id;
    } else if (this.currentLessonContent()) {
      const content = this.currentLessonContent()!;
      const detail = this.courseDetail();
      if (detail) {
        const level = detail.levels.find(l => l.level === this.currentLevelNum());
        if (level) {
          const idx = level.lessons.findIndex(l => l.title === content.title);
          if (idx !== -1) {
            lessonId = level.level * 100 + (idx + 1);
          }
        }
      }
    } else if (this.currentLevelExam()) {
      lessonId = this.currentLevelExam()!.level * 1000;
    }

    if (lessonId !== null) {
      this.courseService.completeLesson(course.id, lessonId);
      if (this.progress() === 100) {
        this.showCertificateAlert();
      }
    }
  }

  isLessonContentCompleted(levelNum: number, lesson: LessonContent): boolean {
    const detail = this.courseDetail();
    if (!detail) return false;
    const idx = detail.levels.find(l => l.level === levelNum)?.lessons.findIndex(l => l.title === lesson.title);
    if (idx === undefined || idx === -1) return false;
    return this.isLessonCompleted(levelNum * 100 + (idx + 1));
  }

  isLevelExamCompleted(levelNum: number): boolean {
    return this.isLessonCompleted(levelNum * 1000);
  }

  private showCertificateAlert() {
    this.courseCompleted.set(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d6efd', '#0d1b2a', '#ffffff']
    });
  }

  isLessonCompleted(lessonId: number): boolean {
    const course = this.course();
    if (!course) return false;
    const completed = this.courseService.completedLessons()[course.id] || [];
    return completed.includes(lessonId);
  }

  youtubeEmbedValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;
    if (!url) return null;
    const regex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(\?.*)?$/;
    return regex.test(url) ? null : { invalidYoutubeEmbed: true };
  }

  toggleEdit() {
    if (this.isEditing()) {
      this.isEditing.set(false);
    } else {
      const content = this.currentLessonContent();
      if (content) {
        const fallbackArray = this.editForm.get('fallbackVideos') as FormArray;
        fallbackArray.clear();
        if (content.fallbackVideos) {
          content.fallbackVideos.forEach(v => {
            fallbackArray.push(this.fb.control(v, [this.youtubeEmbedValidator]));
          });
        }
        this.editForm.patchValue({ 
          video: content.video,
          topic: content.topic,
          purpose: content.purpose,
          important: content.important,
          practice: content.practice,
          activity: content.activity,
          reflection: content.reflection
        });
        this.isEditing.set(true);
      }
    }
  }

  get fallbackVideosFormArray() {
    return this.editForm.get('fallbackVideos') as FormArray;
  }

  addFallbackVideo() {
    this.fallbackVideosFormArray.push(this.fb.control('', [this.youtubeEmbedValidator]));
  }

  removeFallbackVideo(index: number) {
    this.fallbackVideosFormArray.removeAt(index);
  }

  saveEdit() {
    if (this.editForm.valid && this.currentLessonContent()) {
      const updates = this.editForm.value;
      const course = this.course();
      const content = this.currentLessonContent();
      if (course && content) {
        this.contentService.updateLessonContent(course.id, this.currentLevelNum(), content.title, updates);
        this.currentLessonContent.update(curr => curr ? { ...curr, ...updates } : null);
        this.isEditing.set(false);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, colors: ['#3b82f6'] });
      }
    }
  }
}
