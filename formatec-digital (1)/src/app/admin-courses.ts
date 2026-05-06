import { Component, inject, signal } from '@angular/core';
import { CourseService, Course } from './course.service';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-courses',
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="space-y-10 pb-20">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 fade-in">
        <div>
          <h1 class="text-4xl font-bold text-brand-dark tracking-tight">Catálogo de Cursos</h1>
          <p class="text-slate-500 font-medium mt-1">Gestiona el contenido educativo y multimedia de la academia.</p>
        </div>
        <button (click)="openForm()" class="btn-premium !w-auto !px-8 !py-4">
          <mat-icon class="mr-2">add_to_photos</mat-icon>
          Publicar Curso
        </button>
      </header>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden fade-in">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-brand-dark text-white">
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Curso / Programa</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Área</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Parámetros</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (course of courses(); track course.id) {
                <tr class="hover:bg-brand-bg transition-colors group">
                  <td class="px-8 py-6">
                    <div class="flex items-center space-x-5">
                      <div class="h-16 w-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <img [src]="course.image" [alt]="course.title" class="h-full w-full object-cover">
                      </div>
                      <div class="space-y-1">
                        <p class="text-base font-bold text-brand-dark leading-tight">{{ course.title }}</p>
                        <p class="text-[10px] text-slate-400 line-clamp-1 max-w-[250px] font-medium tracking-tight uppercase">{{ course.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-brand-primary/10">
                      {{ course.category }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex flex-col gap-1">
                       <span class="text-[10px] font-bold text-brand-dark uppercase tracking-tight flex items-center">
                          <mat-icon class="!text-xs mr-2 text-slate-300">signal_cellular_alt</mat-icon>
                          Nivel {{ course.level }}
                       </span>
                       <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                          <mat-icon class="!text-xs mr-2 text-slate-300">schedule</mat-icon>
                          {{ course.duration }}
                       </span>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end space-x-1">
                      <button (click)="openForm(course)" 
                              class="p-2.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
                              title="Editar">
                        <mat-icon class="!text-xl">edit_note</mat-icon>
                      </button>
                      <button (click)="deleteCourse(course.id)" 
                              class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Eliminar">
                        <mat-icon class="!text-xl">delete_sweep</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Course Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-brand-bg w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 lg:p-14 space-y-10 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 border border-white/20">
            <header class="flex justify-between items-start">
              <div>
                <h2 class="text-3xl font-bold text-brand-dark tracking-tight">{{ editingCourse() ? 'Editar Programa' : 'Crear Nuevo Curso' }}</h2>
                <p class="text-slate-400 font-medium mt-1">Configura los metadatos y la identidad visual del contenido.</p>
              </div>
              <button (click)="showForm.set(false)" class="p-2 text-slate-400 hover:text-brand-dark hover:bg-white rounded-full transition-colors font-bold">
                <mat-icon>close</mat-icon>
              </button>
            </header>
            
            <form [formGroup]="courseForm" (ngSubmit)="saveCourse()" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label for="course-title" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título del curso</label>
                  <input id="course-title" formControlName="title" placeholder="Ej: Introducción a la Red"
                         class="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold text-brand-dark text-sm shadow-sm">
                </div>
                <div class="space-y-3">
                  <label for="course-category" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Área / Categoría</label>
                  <input id="course-category" formControlName="category" placeholder="Ej: Redes Sociales"
                         class="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold text-brand-dark text-sm shadow-sm">
                </div>
              </div>
              
              <div class="space-y-3">
                <label for="course-description" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resumen del Curso</label>
                <textarea id="course-description" formControlName="description" rows="4" placeholder="Describe los objetivos clave de este programa..."
                          class="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold text-brand-dark text-sm shadow-sm resize-none"></textarea>
              </div>

                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identidad Visual</span>
                  <div class="flex flex-col sm:flex-row items-center gap-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden text-center sm:text-left">
                  <div class="h-40 w-40 rounded-[2.5rem] bg-brand-bg border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shadow-inner shrink-0 group">
                    @if (courseForm.get('image')?.value) {
                      <img [src]="courseForm.get('image')?.value" alt="Vista previa" class="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500">
                    } @else {
                      <mat-icon class="text-slate-200 !text-5xl">image</mat-icon>
                    }
                  </div>
                  <div class="flex-1 space-y-4 text-center sm:text-left">
                     <p class="text-slate-400 text-xs font-medium leading-relaxed">
                        Recomendamos una imagen de alta resolución (16:9). El archivo se optimizará automáticamente para la web.
                     </p>
                     <label for="course-image-input" class="cursor-pointer inline-flex items-center px-8 py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all text-xs tracking-tight shadow-lg shadow-brand-primary/20">
                        <mat-icon class="mr-2 !text-sm">upload_file</mat-icon>
                        Subir Portada
                        <input id="course-image-input" type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
                     </label>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label for="course-duration" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Carga Horaria</label>
                  <input id="course-duration" formControlName="duration" placeholder="Ej: 14 Horas"
                         class="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold text-brand-dark text-sm shadow-sm">
                </div>
                <div class="space-y-3">
                  <label for="course-level" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Grado de Complejidad</label>
                  <div class="relative">
                    <select id="course-level" formControlName="level" 
                            class="w-full pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-primary transition-all appearance-none font-bold text-brand-dark text-sm shadow-sm cursor-pointer">
                      <option value="Básico">Básico - Nivel 0</option>
                      <option value="Intermedio">Intermedio - Nivel 1</option>
                      <option value="Avanzado">Avanzado - Nivel 2</option>
                    </select>
                    <mat-icon class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">expand_more</mat-icon>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit" [disabled]="courseForm.invalid" 
                        class="btn-premium !py-5 !text-base shadow-2xl">
                   {{ editingCourse() ? 'Actualizar Información' : 'Publicar Ahora' }}
                </button>
                <button type="button" (click)="showForm.set(false)" 
                        class="w-full py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm tracking-tight order-last sm:order-first">
                  Descartar
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminCourses {
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  
  courses = this.courseService.getCourses();
  showForm = signal(false);
  editingCourse = signal<Course | null>(null);

  courseForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    image: ['', Validators.required],
    duration: ['', Validators.required],
    level: ['Básico', Validators.required]
  });

  openForm(course?: Course) {
    this.editingCourse.set(course || null);
    if (course) {
      this.courseForm.patchValue(course);
    } else {
      this.courseForm.reset({ level: 'Básico' });
    }
    this.showForm.set(true);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.courseForm.patchValue({ image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  saveCourse() {
    const val = this.courseForm.value as Course;
    if (this.editingCourse()) {
      this.courseService.updateCourse({ ...val, id: this.editingCourse()!.id, levels: this.editingCourse()!.levels });
    } else {
      this.courseService.addCourse({ ...val, levels: [] });
    }
    this.showForm.set(false);
  }

  deleteCourse(id: number) {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      this.courseService.deleteCourse(id);
    }
  }
}
