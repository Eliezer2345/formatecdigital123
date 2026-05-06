import { Component, inject, signal } from '@angular/core';
import { AuthService, User } from './auth.service';
import { CourseService } from './course.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  imports: [MatIconModule, MatTooltipModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="space-y-10 pb-20">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 fade-in">
        <div>
          <h1 class="text-4xl font-bold text-brand-dark tracking-tight">Gestión de Usuarios</h1>
          <p class="text-slate-500 font-medium mt-1">Control de accesos, roles y seguimiento académico.</p>
        </div>
        <button (click)="openForm()" class="btn-premium !w-auto !px-8 !py-4">
          <mat-icon class="mr-2">person_add</mat-icon>
          Registrar Usuario
        </button>
      </header>

      <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden fade-in">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-brand-dark text-white">
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Identidad</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Credenciales</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Atribución</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 text-center">Actividad</th>
                <th class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (user of users(); track user.id) {
                @let userData = getUserData(user.email);
                <tr class="hover:bg-brand-bg transition-colors group">
                  <td class="px-8 py-6">
                    <div class="flex items-center space-x-4">
                      <div class="h-12 w-12 rounded-xl bg-brand-bg flex items-center justify-center text-brand-primary font-bold text-lg border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform shrink-0">
                        @if (user.profileImage) {
                          <img [src]="user.profileImage" [alt]="user.name" class="h-full w-full object-cover" referrerpolicy="no-referrer">
                        } @else {
                          {{ user.name.charAt(0) }}
                        }
                      </div>
                      <span class="text-sm font-bold text-brand-dark tracking-tight">{{ user.name }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-xs font-bold text-slate-400 font-mono tracking-tight">{{ user.email }}</td>
                  <td class="px-8 py-6">
                    <span class="px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest inline-block"
                          [class.bg-brand-primary/10]="user.role === 'admin'"
                          [class.text-brand-primary]="user.role === 'admin'"
                          [class.bg-slate-100]="user.role === 'user'"
                          [class.text-slate-500]="user.role === 'user'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <div class="flex items-center justify-center space-x-2">
                       <div class="flex -space-x-2">
                          @for (courseId of userData?.cursos?.slice(0, 3); track courseId) {
                             <div class="h-6 w-6 rounded-md bg-white border border-slate-200 overflow-hidden" [title]="getCourseTitle(courseId)">
                                <img [src]="getCourse(courseId)?.image" [alt]="getCourseTitle(courseId)" class="h-full w-full object-cover" referrerpolicy="no-referrer">
                             </div>
                          }
                       </div>
                       @if ((userData?.cursos?.length || 0) > 3) {
                          <span class="text-[9px] text-brand-primary font-bold tracking-tight">
                            +{{ userData.cursos.length - 3 }}
                          </span>
                       } @else if ((userData?.cursos?.length || 0) === 0) {
                          <span class="text-[9px] text-slate-300 font-bold uppercase">Sin Inscripción</span>
                       }
                    </div>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <div class="flex items-center justify-end space-x-2">
                      <button (click)="viewUserDetails(user)" 
                              class="flex items-center space-x-2 px-4 py-2.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all group/btn border border-transparent hover:border-brand-primary/10" 
                              matTooltip="Ver Detalles Académicos"
                              aria-label="Ver detalles académicos del usuario">
                        <mat-icon class="!text-xl group-hover/btn:scale-110 transition-transform">visibility</mat-icon>
                        <span class="text-[10px] font-bold uppercase tracking-widest hidden xl:inline">Ver Detalles</span>
                      </button>
                      
                      <div class="h-6 w-px bg-slate-100 mx-1"></div>

                      <button (click)="openForm(user)" 
                              class="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" 
                              matTooltip="Editar Perfil"
                              aria-label="Editar perfil de usuario">
                        <mat-icon class="!text-xl">edit_note</mat-icon>
                      </button>
                      <button (click)="deleteUser(user.id)" 
                              class="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                              matTooltip="Eliminar Usuario"
                              aria-label="Eliminar usuario">
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

      <!-- User Form Modal -->
      @if (showForm()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-10 animate-in zoom-in duration-300 border border-white/20">
            <header class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-brand-dark tracking-tight">{{ editingUser() ? 'Modificar Usuario' : 'Nuevo Registro' }}</h2>
                <p class="text-slate-400 text-sm font-medium mt-1">Configura credenciales y privilegios.</p>
              </div>
              <button (click)="showForm.set(false)" class="p-2 text-slate-400 hover:text-brand-dark hover:bg-brand-bg rounded-full transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </header>
            
            <form [formGroup]="userForm" (ngSubmit)="saveUser()" class="space-y-6">
              <div class="space-y-2">
                <label for="user-name" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <div class="relative group">
                   <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">person_outline</mat-icon>
                   <input id="user-name" formControlName="name" placeholder="Ej: Juan Pérez"
                          class="w-full pl-14 pr-6 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all font-bold text-brand-dark text-sm placeholder:text-slate-300">
                </div>
              </div>
              <div class="space-y-2">
                <label for="user-email" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                <div class="relative group">
                   <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-primary transition-colors">alternate_email</mat-icon>
                   <input id="user-email" formControlName="email" type="email" placeholder="usuario@ejemplo.com"
                          class="w-full pl-14 pr-6 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all font-bold text-brand-dark text-sm placeholder:text-slate-300">
                </div>
              </div>
              <div class="space-y-2">
                <label for="user-role" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Rol de Acceso</label>
                <div class="relative">
                  <mat-icon class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">shield</mat-icon>
                  <select id="user-role" formControlName="role" 
                          class="w-full pl-14 pr-12 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none font-bold text-brand-dark text-sm">
                    <option value="user">Usuario Estudiante</option>
                    <option value="admin">Administrador Global</option>
                  </select>
                  <mat-icon class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">expand_more</mat-icon>
                </div>
              </div>
              
              <div class="flex flex-col gap-4 pt-4">
                <button type="submit" [disabled]="userForm.invalid" 
                        class="btn-premium !py-5 !text-base">
                  {{ editingUser() ? 'Guardar Cambios' : 'Confirmar Registro' }}
                </button>
                <button type="button" (click)="showForm.set(false)" 
                        class="w-full py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all text-sm tracking-tight">
                  Cancelar Operación
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- User Details Modal -->
      @if (selectedUserDetails()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-brand-bg w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="bg-brand-dark p-10 text-white relative">
               <div class="absolute top-0 right-0 h-64 w-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
               
               <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div class="h-24 w-24 rounded-[2rem] bg-brand-primary/20 flex items-center justify-center text-white font-bold text-4xl border border-white/10 shadow-2xl overflow-hidden group">
                    @if (selectedUserDetails()?.profileImage) {
                      <img [src]="selectedUserDetails()?.profileImage" [alt]="selectedUserDetails()?.name" class="h-full w-full object-cover" referrerpolicy="no-referrer">
                    } @else {
                      {{ selectedUserDetails()?.name?.charAt(0) }}
                    }
                  </div>
                  <div class="flex-1 text-center md:text-left">
                    <h2 class="text-3xl font-bold tracking-tight mb-1">{{ selectedUserDetails()?.name }}</h2>
                    <p class="text-brand-primary font-bold text-[10px] uppercase tracking-widest flex items-center justify-center md:justify-start">
                       <mat-icon class="mr-2 !text-xs">verified_user</mat-icon>
                       {{ selectedUserDetails()?.role }}
                    </p>
                    <div class="mt-4 flex items-center justify-center md:justify-start space-x-6 text-slate-400 font-mono text-[10px]">
                       <span>{{ selectedUserDetails()?.email }}</span>
                    </div>
                  </div>
                  <button (click)="selectedUserDetails.set(null)" class="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                    <mat-icon>close</mat-icon>
                  </button>
               </div>
            </div>

            <div class="p-10 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
              <!-- Academic Summary Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1 hover:border-brand-primary/20 transition-colors">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cursos Activos</p>
                    <p class="text-2xl font-bold text-brand-dark leading-none">
                       {{ (getUserData(selectedUserDetails()?.email!)?.cursos?.length || 0) }}
                    </p>
                 </div>
                 <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1 hover:border-brand-primary/20 transition-colors">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Promedio Progreso</p>
                    <p class="text-2xl font-bold text-brand-primary leading-none italic">
                       {{ getAverageProgress(getUserData(selectedUserDetails()?.email!)?.progreso || {}) }}%
                    </p>
                 </div>
                 <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-1 col-span-2 sm:col-span-1 border-emerald-50 bg-emerald-50/10">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Estatus Académico</p>
                    <div class="flex items-center space-x-2">
                       <span class="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                       <p class="text-xs font-bold text-emerald-500 uppercase tracking-tight leading-none">Activo en Red</p>
                    </div>
                 </div>
              </div>

              <div class="space-y-6">
                <div class="flex items-center justify-between">
                   <h3 class="text-sm font-bold text-brand-dark uppercase tracking-widest flex items-center">
                      <mat-icon class="mr-3 text-brand-primary">history_edu</mat-icon>
                      Detalle de Formación
                   </h3>
                </div>

                @let userCourses = getUserData(selectedUserDetails()?.email!)?.cursos || [];
                @let userProgress = getUserData(selectedUserDetails()?.email!)?.progreso || {};

              @if (userCourses.length > 0) {
                <div class="grid gap-6">
                  @for (courseId of userCourses; track courseId) {
                    @let course = getCourse(courseId);
                    @let progress = calculateProgress(userProgress[courseId] || []);
                    <div class="p-8 bg-white rounded-3xl border border-slate-100 space-y-5 shadow-sm group hover:shadow-md transition-shadow">
                      <div class="flex justify-between items-start">
                        <div class="flex items-center gap-4">
                           <div class="h-12 w-12 rounded-xl border border-slate-100 overflow-hidden shrink-0">
                              <img [src]="course?.image" [alt]="course?.title" class="w-full h-full object-cover">
                           </div>
                           <div class="space-y-1">
                              <span class="text-base font-bold text-brand-dark leading-tight">{{ course?.title }}</span>
                              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 Progreso Actual: {{ progress }}%
                              </div>
                           </div>
                        </div>
                        @if (progress === 100) {
                           <div class="h-8 w-8 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                              <mat-icon class="!text-xl">workspace_premium</mat-icon>
                           </div>
                        }
                      </div>

                      <div class="space-y-2">
                        <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div class="bg-brand-primary h-full transition-all duration-1000" [style.width.%]="progress"></div>
                        </div>
                        <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <span>{{ (userProgress[courseId]?.length || 0) }} Hitos completados</span>
                          <span [class.text-emerald-500]="progress === 100">{{ progress === 100 ? 'Finalizado' : 'Iniciado' }}</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="py-16 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                  <div class="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                     <mat-icon class="!text-3xl">sentiment_neutral</mat-icon>
                  </div>
                  <p class="text-slate-400 font-bold text-sm">Este usuario aún no registra actividad académica.</p>
                </div>
              }
            </div>
          </div>

          <div class="p-8 bg-white border-t border-slate-100 flex gap-4">
               <button (click)="selectedUserDetails.set(null)" class="flex-1 py-5 bg-brand-dark text-white font-bold rounded-2xl hover:bg-black transition-all text-sm tracking-tight">
                  Finalizar Revisión
               </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminUsers {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  
  users = this.auth.getUsers();
  showForm = signal(false);
  editingUser = signal<User | null>(null);
  selectedUserDetails = signal<User | null>(null);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required]
  });

  getUserData(email: string) {
    return this.courseService.getUserData(email);
  }

  getCourseTitle(id: number) {
    return this.courseService.getCourseById(id)?.title || 'Curso Desconocido';
  }

  getCourse(id: number) {
    return this.courseService.getCourseById(id);
  }

  getAverageProgress(progreso: Record<number, { id: number, completed: boolean }[]>): number {
    const courseIds = Object.keys(progreso);
    if (courseIds.length === 0) return 0;
    
    let total = 0;
    courseIds.forEach(id => {
      total += this.calculateProgress(progreso[Number(id)] || []);
    });
    
    return Math.round(total / courseIds.length);
  }

  calculateProgress(lessons: { id: number, completed: boolean }[]): number {
    const completedCount = lessons.filter(l => l.completed).length;
    return Math.min(100, completedCount * 5);
  }

  viewUserDetails(user: User) {
    this.selectedUserDetails.set(user);
  }

  openForm(user?: User) {
    this.editingUser.set(user || null);
    if (user) {
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset({ role: 'user' });
    }
    this.showForm.set(true);
  }

  saveUser() {
    const val = this.userForm.value as User;
    if (this.editingUser()) {
      this.auth.updateUser({ ...val, id: this.editingUser()!.id });
    } else {
      this.auth.addUser(val);
    }
    this.showForm.set(false);
  }

  deleteUser(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.auth.deleteUser(id);
    }
  }
}
