import { Component, inject, computed, signal } from '@angular/core';
import { CourseService } from './course.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-theme-main pt-32 pb-20 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Profile Info -->
          <div class="lg:col-span-1">
            <div class="bg-theme-surface rounded-3xl shadow-xl border border-theme p-8 text-center sticky top-28 fade-in">
              <div class="relative inline-block mb-8">
                <div class="h-32 w-32 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary mx-auto overflow-hidden ring-4 ring-theme shadow-xl">
                  @if (auth.user()?.profileImage) {
                    <img [src]="auth.user()?.profileImage" [alt]="auth.user()?.name" class="h-full w-full object-cover" referrerpolicy="no-referrer">
                  } @else {
                    <mat-icon class="!text-6xl text-theme-muted">person</mat-icon>
                  }
                </div>
                <button (click)="isEditing.set(true)" class="absolute bottom-1 right-1 p-2 bg-brand-primary text-white rounded-xl shadow-lg border-2 border-theme hover:scale-110 transition-transform">
                  <mat-icon class="!text-lg">edit</mat-icon>
                </button>
              </div>
              
              <h2 class="text-2xl font-bold text-theme-main mb-1">{{ auth.user()?.name }}</h2>
              <p class="text-theme-muted mb-8 font-medium">{{ auth.user()?.email }}</p>
              
              <div class="grid grid-cols-2 gap-4 border-t border-theme pt-8">
                <div class="text-center p-4 bg-theme-main rounded-2xl border border-theme">
                  <p class="text-2xl font-bold text-brand-primary">{{ enrolledCourses().length }}</p>
                  <p class="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Inscritos</p>
                </div>
                <div class="text-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                  <p class="text-2xl font-bold text-emerald-500">{{ completedCount() }}</p>
                  <p class="text-[10px] text-theme-muted uppercase tracking-widest font-bold">Logros</p>
                </div>
              </div>

              <div class="mt-8 space-y-3">
                 <a routerLink="/diplomas" class="btn-premium w-full !text-xs !py-4">
                    Mis Diplomas
                    <mat-icon class="!text-lg">workspace_premium</mat-icon>
                 </a>
              </div>
            </div>
          </div>

          <!-- Enrolled Courses -->
          <div class="lg:col-span-2 space-y-8 fade-in">
            <div class="bg-theme-surface rounded-3xl shadow-xl border border-theme p-8 sm:p-10">
              <div class="flex items-center justify-between mb-10">
                <div>
                   <h3 class="text-3xl font-bold text-theme-main">Mi Aprendizaje</h3>
                   <p class="text-theme-muted font-medium">Continúa donde lo dejaste.</p>
                </div>
                <mat-icon class="text-brand-primary !text-4xl opacity-20">auto_stories</mat-icon>
              </div>

              <div class="space-y-6">
                @for (course of enrolledCourses(); track course.id) {
                  <div class="flex flex-col sm:flex-row items-center p-5 rounded-2xl border border-theme hover:bg-theme-main transition-all group relative overflow-hidden">
                    <div class="h-28 w-full sm:w-48 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-8 shadow-md">
                      <img [src]="course.image" [alt]="course.title" class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" referrerpolicy="no-referrer">
                    </div>
                    <div class="flex-1 text-center sm:text-left">
                      <div class="inline-flex items-center px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-bold uppercase tracking-widest rounded mb-2">
                        {{ course.category }}
                      </div>
                      <h4 class="text-xl font-bold text-theme-main mb-4 group-hover:text-brand-primary transition-colors line-clamp-1">
                        {{ course.title }}
                      </h4>
                      <div class="max-w-xs mx-auto sm:mx-0">
                        <div class="flex justify-between items-center text-[10px] font-bold text-theme-muted uppercase tracking-widest mb-2">
                           <span>Progreso</span>
                           <span class="text-brand-primary">{{ courseService.getCourseProgress(course.id) }}%</span>
                        </div>
                        <div class="w-full bg-theme-main rounded-full h-1.5 overflow-hidden">
                          <div class="bg-brand-primary h-full transition-all duration-1000" [style.width.%]="courseService.getCourseProgress(course.id)"></div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-6 sm:mt-0 ml-0 sm:ml-8 flex items-center gap-3">
                      @if (courseService.getCourseProgress(course.id) === 100) {
                        <a routerLink="/diplomas" class="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20" title="Ver Certificado">
                           <mat-icon class="!text-lg">workspace_premium</mat-icon>
                        </a>
                      }
                      
                      <a [routerLink]="['/course-content', course.id]" 
                         class="btn-premium whitespace-nowrap !px-6 !py-3 !text-sm shadow-lg shadow-brand-primary/20">
                        {{ courseService.getCourseProgress(course.id) > 0 ? 'Continuar' : 'Empezar' }}
                        <mat-icon class="!text-sm">play_arrow</mat-icon>
                      </a>
                      
                      <button (click)="courseService.unenroll(course.id)" 
                              class="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all hover:text-white border border-red-500/20 shadow-sm"
                              title="Anular Inscripción">
                         <mat-icon class="!text-lg">close</mat-icon>
                      </button>
                    </div>

                    @if (courseService.getCourseProgress(course.id) === 100) {
                       <div class="absolute top-2 right-2">
                          <mat-icon class="text-emerald-500 !text-2xl drop-shadow-sm">verified</mat-icon>
                       </div>
                    }
                  </div>
                } @empty {
                  <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div class="h-20 w-20 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                      <mat-icon class="!text-4xl">chrome_reader_mode</mat-icon>
                    </div>
                    <h4 class="text-xl font-bold text-brand-dark mb-2">Sin cursos activos</h4>
                    <p class="text-slate-500 mb-8 max-w-sm mx-auto font-medium">Parece que aún no te has inscrito en ningún programa. ¡Empieza tu camino hoy!</p>
                    <a routerLink="/courses" class="btn-premium inline-flex !w-auto px-8">
                      Explorar Cursos
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    @if (isEditing()) {
      <div class="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 fade-in">
        <div class="bg-theme-surface rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 relative overflow-hidden border border-theme">
          <div class="absolute top-0 inset-x-0 h-1.5 bg-brand-primary"></div>
          
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                <mat-icon>settings</mat-icon>
             </div>
             <h3 class="text-2xl font-bold text-theme-main tracking-tighter">Ajustes de Perfil</h3>
          </div>

          <form [formGroup]="editForm" (ngSubmit)="saveProfile()" class="space-y-6">
            <div class="space-y-2">
              <label for="profile-name" class="text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
              <input id="profile-name" formControlName="name" class="w-full px-5 py-4 bg-theme-main border border-theme rounded-2xl outline-none focus:border-brand-primary transition-all font-medium text-theme-main">
            </div>
            
            <div class="space-y-2">
              <span class="block text-[10px] font-black text-theme-muted uppercase tracking-[0.2em] ml-1">Fotografía de Perfil</span>
              <div class="flex items-center gap-6 p-4 bg-theme-main rounded-2xl border border-theme">
                <div class="h-20 w-20 rounded-full bg-theme-surface overflow-hidden ring-2 ring-brand-primary/20 flex items-center justify-center border border-theme">
                  @if (previewImage()) {
                    <img [src]="previewImage()" alt="Prueba" class="h-full w-full object-cover">
                  } @else {
                    <mat-icon class="!text-3xl text-theme-muted">person</mat-icon>
                  }
                </div>
                <label for="profile-pic-upload" class="cursor-pointer px-5 py-2.5 bg-theme-surface border border-theme rounded-xl text-xs font-bold text-theme-main hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-sm">
                  Subir Foto
                  <input id="profile-pic-upload" type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
                </label>
              </div>
            </div>

            <div class="flex gap-4 mt-10">
              <button type="button" (click)="isEditing.set(false)" class="flex-1 py-4 px-4 bg-theme-main text-theme-muted font-bold rounded-2xl hover:bg-theme-surface border border-theme transition-all uppercase tracking-widest text-[10px]">
                Cerrar
              </button>
              <button type="submit" [disabled]="editForm.invalid" class="btn-premium flex-[2] !py-4 shadow-xl shadow-brand-primary/20">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class Profile {
  public courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  notification = inject(NotificationService);
  
  completedCount = computed(() => {
    return this.courseService.getCourses()().filter(c => 
      this.courseService.getCourseProgress(c.id) === 100
    ).length;
  });

  enrolledCourses = computed(() => this.courseService.getEnrolledCourses());
  isEditing = signal(false);
  previewImage = signal<string | null>(this.auth.user()?.profileImage || null);

  editForm = this.fb.group({
    name: [this.auth.user()?.name || '', Validators.required]
  });

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.editForm.valid) {
      const val = this.editForm.value;
      this.auth.updateProfile({
        name: val.name || '',
        profileImage: this.previewImage() || ''
      });
      this.notification.showToast('Perfil actualizado correctamente', 'success');
      this.isEditing.set(false);
    }
  }
}
