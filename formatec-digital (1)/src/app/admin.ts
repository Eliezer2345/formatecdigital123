import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';
import { CourseService } from './course.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, MatIconModule],
  template: `
    <div class="flex min-h-screen bg-brand-bg pt-16">
      <!-- Admin Sidebar -->
      <aside class="w-72 bg-brand-dark text-white hidden lg:block sticky top-16 h-[calc(100vh-64px)] shadow-2xl z-20 border-r border-white/5">
        <div class="p-8 flex flex-col h-full">
          <div class="flex items-center space-x-3 mb-10">
            <div class="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
              <mat-icon class="!text-2xl">admin_panel_settings</mat-icon>
            </div>
            <div>
              <h2 class="text-sm font-bold text-white leading-none tracking-tight">Administración</h2>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Formatec Digital</p>
            </div>
          </div>

          <nav class="space-y-2 flex-1">
            <a routerLink="/admin" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="bg-white/10 text-brand-primary border-brand-primary border-l-4"
               class="flex items-center px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all group">
              <mat-icon class="mr-4 group-hover:scale-110 transition-transform">dashboard</mat-icon>
              Resumen
            </a>
            <a routerLink="/admin/users" routerLinkActive="bg-white/10 text-brand-primary border-brand-primary border-l-4"
               class="flex items-center px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all group">
              <mat-icon class="mr-4 group-hover:scale-110 transition-transform">people</mat-icon>
              Usuarios
            </a>
            <a routerLink="/admin/courses" routerLinkActive="bg-white/10 text-brand-primary border-brand-primary border-l-4"
               class="flex items-center px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all group">
              <mat-icon class="mr-4 group-hover:scale-110 transition-transform">library_books</mat-icon>
              Cursos
            </a>
            <a routerLink="/admin/audit" routerLinkActive="bg-white/10 text-brand-primary border-brand-primary border-l-4"
               class="flex items-center px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all group">
              <mat-icon class="mr-4 group-hover:scale-110 transition-transform">security</mat-icon>
              Auditoría
            </a>
          </nav>

          <div class="mt-auto pt-8 border-t border-white/5">
            <a routerLink="/" class="flex items-center px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-all group">
              <mat-icon class="mr-4 group-hover:-translate-x-1 transition-transform">arrow_back</mat-icon>
              Sitio Web
            </a>
          </div>
        </div>
      </aside>

      <!-- Main Admin Content -->
      <main class="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div class="max-w-6xl mx-auto fade-in">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
})
export class AdminDashboard {}

@Component({
  selector: 'app-admin-stats',
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="space-y-10">
      <header class="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
        <!-- Background Decor -->
        <div class="absolute inset-0 pointer-events-none">
           <div class="absolute top-0 right-0 h-64 w-64 bg-brand-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-1000 group-hover:scale-110"></div>
           <div class="absolute bottom-0 left-0 h-32 w-32 bg-brand-primary/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
        </div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div class="h-24 w-24 bg-brand-dark rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shrink-0 group-hover:rotate-6 transition-transform">
            <mat-icon class="!text-5xl">dashboard_customize</mat-icon>
          </div>
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-4xl font-bold text-brand-dark tracking-tight mb-2">Resumen de Gestión</h1>
            <p class="text-lg text-slate-500 max-w-xl font-medium">
              Panel de control administrativo para Formatec Digital. Monitoriza el rendimiento de la plataforma en tiempo real.
            </p>
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            <a routerLink="/admin/courses" class="btn-premium whitespace-nowrap !text-[10px] !px-8">
               <mat-icon class="!text-lg">add_circle</mat-icon>
               Nuevo Curso
            </a>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Stat Card -->
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div class="relative z-10">
             <div class="flex items-center justify-between mb-8">
                <div class="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                   +12% este mes
                </div>
             </div>
             <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Usuarios</h3>
             <p class="text-4xl font-bold text-brand-dark">{{ auth.getUsers()().length }}</p>
          </div>
          <div class="absolute -bottom-6 -right-6 h-32 w-32 bg-slate-50 rounded-full group-hover:scale-110 transition-transform"></div>
        </div>
        
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div class="relative z-10">
             <div class="flex items-center justify-between mb-8">
                <div class="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <mat-icon>library_books</mat-icon>
                </div>
                <div class="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">
                   Catálogo Activo
                </div>
             </div>
             <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cursos Ofrecidos</h3>
             <p class="text-4xl font-bold text-brand-dark">{{ courseService.getCourses()().length }}</p>
          </div>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
          <div class="relative z-10">
             <div class="flex items-center justify-between mb-8">
                <div class="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <mat-icon>emoji_events</mat-icon>
                </div>
                <div class="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded">
                   Meta Alcanzada
                </div>
             </div>
             <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Diplomas Emitidos</h3>
             <p class="text-4xl font-bold text-brand-dark">128</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminStats {
  auth = inject(AuthService);
  courseService = inject(CourseService);
}
