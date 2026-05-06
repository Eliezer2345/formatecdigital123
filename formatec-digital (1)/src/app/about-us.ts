import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen bg-brand-dark text-white selection:bg-brand-primary/30">
      <!-- Hero Section with Personal Card -->
      <section class="relative pt-40 pb-20 px-4 overflow-hidden">
        <!-- Background Decorative Elements -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-brand-primary/10 blur-[140px] rounded-full -z-10"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[100px] rounded-full -z-10"></div>

        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <!-- Text Content -->
            <div class="lg:col-span-7 space-y-10 text-center lg:text-left fade-in">
              <div class="inline-flex items-center px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-xl text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                Pensamiento Estratégico
              </div>
              <h1 class="text-6xl sm:text-8xl font-bold tracking-tight leading-[1] text-white">
                Eliezer <br>
                <span class="text-brand-primary italic">Martinez.</span>
              </h1>
              <p class="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                Desarrolladora de software y arquitecto de experiencias educativas. Enfocado en transformar el aprendizaje tradicional a través de la tecnología.
              </p>
              
              <div class="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <div class="flex items-center space-x-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <mat-icon class="text-brand-primary">terminal</mat-icon>
                  <span class="text-sm font-bold tracking-tight uppercase">6to E Informática</span>
                </div>
                <div class="flex items-center space-x-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <mat-icon class="text-brand-primary">verified</mat-icon>
                  <span class="text-sm font-bold tracking-tight uppercase">Desarrollador Full Stack</span>
                </div>
              </div>
            </div>

            <!-- Professional Card -->
            <div class="lg:col-span-5 fade-in">
              <div class="relative group">
                <div class="absolute -inset-2 bg-brand-primary rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                
                <div class="relative bg-slate-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
                  <div class="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  
                  <div class="space-y-10">
                    <div class="relative w-36 h-36 mx-auto">
                       <div class="absolute inset-0 bg-brand-primary/20 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform"></div>
                      <img [src]="profileImage() || defaultAvatar" 
                           alt="Eliezer Martinez" 
                           class="relative w-full h-full rounded-[2rem] object-cover border-2 border-white/10 shadow-2xl transition-transform group-hover:rotate-3">
                      <label class="absolute -bottom-3 -right-3 bg-brand-primary p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-brand-primary/80 transition-all text-white border border-white/20">
                        <mat-icon class="!text-lg">add_a_photo</mat-icon>
                        <input type="file" class="hidden" (change)="onProfileFileSelected($event)" accept="image/*">
                      </label>
                    </div>

                    <div class="text-center space-y-2">
                       <h2 class="text-xl font-bold tracking-tight text-white leading-tight">Eliezer Feliz Martinez Soriano</h2>
                       <p class="text-brand-primary font-bold text-[9px] uppercase tracking-[0.2em]">Visión Tecnológica</p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 pt-6 border-t border-white/5">
                      <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Supervisor Académico</span>
                        <span class="text-xs font-bold text-white tracking-tight leading-none">Jhoan Manuel de Jesús</span>
                      </div>
                      <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Alma Mater</span>
                        <span class="text-xs font-bold text-white tracking-tight leading-none">P. Virgen de la Altagracia</span>
                      </div>
                    </div>

                    <div class="flex justify-center space-x-3 pt-2">
                       @for (icon of ['mail', 'auto_fix_high', 'webhook']; track icon) {
                        <button class="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1">
                          <mat-icon class="!text-xl">{{ icon }}</mat-icon>
                        </button>
                       }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Educational Center Section -->
      <section class="py-32 px-4 bg-white/2">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div class="relative group">
              <div class="absolute -inset-10 bg-brand-primary/10 blur-[100px] rounded-full group-hover:opacity-40 transition-opacity"></div>
              <div class="relative rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl aspect-square scale-95 group-hover:scale-100 transition-transform duration-1000 bg-slate-800">
                <img [src]="institutionImage()" 
                     alt="Politécnico Virgen de la Altagracia" 
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80"></div>
                <div class="absolute bottom-12 left-12 right-12 space-y-3">
                  <div class="inline-flex px-4 py-1.5 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-xl">
                    Sede Central
                  </div>
                  <h3 class="text-3xl font-bold tracking-tight">Politécnico Virgen de la Altagracia</h3>
                </div>
                
                <!-- Admin Edit Button for Institution Image -->
                @if (auth.isAdmin()) {
                  <label class="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-3xl shadow-2xl cursor-pointer hover:bg-brand-primary hover:scale-110 transition-all text-white border border-white/20 group/edit">
                    <mat-icon class="!text-2xl">edit_square</mat-icon>
                    <span class="absolute right-full mr-4 bg-black/80 px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Cambiar imagen de sede</span>
                    <input type="file" class="hidden" (change)="onInstitutionFileSelected($event)" accept="image/*">
                  </label>
                }
              </div>
            </div>

            <div class="space-y-12">
              <div class="space-y-8">
                <h2 class="text-5xl sm:text-6xl font-bold tracking-tight leading-tight text-white">
                  Formación <br>
                  <span class="text-brand-primary italic underline decoration-white/10">Sin Límites.</span>
                </h2>
                <p class="text-xl text-slate-400 leading-relaxed font-medium">
                  Una institución de prestigio dedicada a forjar una nueva generación de profesionales técnicos con valores sólidos y competencias globales de vanguardia.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-6">
                <div class="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-8 group hover:bg-white/10 transition-colors">
                  <div class="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                    <mat-icon class="!text-3xl">school</mat-icon>
                  </div>
                  <div class="space-y-1">
                     <h4 class="font-bold text-xl text-white">Técnica Superior</h4>
                     <p class="text-sm text-slate-500 font-medium leading-relaxed">Currículo optimizado para las demandas actuales del sector informático y empresarial.</p>
                  </div>
                </div>
                <div class="p-8 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-8 group hover:bg-white/10 transition-colors">
                  <div class="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary shadow-xl shrink-0 group-hover:scale-110 transition-transform">
                    <mat-icon class="!text-3xl">public</mat-icon>
                  </div>
                  <div class="space-y-1">
                     <h4 class="font-bold text-xl text-white">Impacto Social</h4>
                     <p class="text-sm text-slate-500 font-medium leading-relaxed">Formación integral enfocada en la responsabilidad ciudadana y el desarrollo sostenible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Platform Features -->
      <section class="py-32 px-4 relative">
        <div class="max-w-7xl mx-auto space-y-20">
          <div class="text-center space-y-6 max-w-2xl mx-auto">
            <div class="inline-flex items-center px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-xl">
               Nuestra Esencia
            </div>
            <h2 class="text-4xl sm:text-5xl font-bold tracking-tight">Cultura <span class="text-brand-primary italic">Formatec.</span></h2>
            <p class="text-slate-400 text-lg font-medium leading-relaxed">
              Diseñamos cada módulo pensando en la accesibilidad, la seguridad y la excelencia pedagógica.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div class="p-12 bg-white/5 border border-white/10 rounded-[3rem] group hover:bg-brand-primary transition-all duration-700">
              <div class="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-10 group-hover:bg-white group-hover:text-brand-primary transition-colors shadow-2xl">
                <mat-icon class="!text-2xl">lock_open</mat-icon>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">Cripto-Seguridad</h3>
              <p class="text-slate-500 font-medium leading-relaxed group-hover:text-white/80 transition-colors">Sistemas avanzados de protección de datos y verificación de identidad de última generación.</p>
            </div>

            <div class="p-12 bg-white/5 border border-white/10 rounded-[3rem] group hover:bg-brand-primary transition-all duration-700">
              <div class="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-10 group-hover:bg-white group-hover:text-brand-primary transition-colors shadow-2xl">
                <mat-icon class="!text-2xl">rocket_launch</mat-icon>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">Inmersión Digital</h3>
              <p class="text-slate-500 font-medium leading-relaxed group-hover:text-white/80 transition-colors">Contenido proyectado con estándares de alta fidelidad para un aprendizaje total y envolvente.</p>
            </div>

            <div class="p-12 bg-white/5 border border-white/10 rounded-[3rem] group hover:bg-brand-primary transition-all duration-700">
              <div class="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-10 group-hover:bg-white group-hover:text-brand-primary transition-colors shadow-2xl">
                <mat-icon class="!text-2xl">military_tech</mat-icon>
              </div>
              <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-white transition-colors">Certificación I+D</h3>
              <p class="text-slate-500 font-medium leading-relaxed group-hover:text-white/80 transition-colors">Titulaciones digitales con validación QR que garantizan tu peritaje en el mercado informático.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Partners Section -->
      <section class="py-24 px-4 bg-brand-dark overflow-hidden">
        <div class="max-w-7xl mx-auto space-y-12">
           <div class="text-center space-y-2">
              <p class="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Nuestra Red</p>
              <h2 class="text-3xl font-black text-white">Instituciones Aliadas</h2>
           </div>
           
           <div class="flex flex-wrap justify-center items-center gap-16 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <div class="flex items-center gap-2">
                <mat-icon class="text-white !text-3xl">school</mat-icon>
                <span class="text-white font-black tracking-widest text-lg">ACADEMY</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-white !text-3xl">verified_user</mat-icon>
                <span class="text-white font-black tracking-widest text-lg">TRUSTED</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-white !text-3xl">health_and_safety</mat-icon>
                <span class="text-white font-black tracking-widest text-lg">SALUD</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-white !text-3xl">biotech</mat-icon>
                <span class="text-white font-black tracking-widest text-lg">BIO-TECH</span>
              </div>
              <div class="flex items-center gap-2">
                <mat-icon class="text-white !text-3xl">architecture</mat-icon>
                <span class="text-white font-black tracking-widest text-lg">DESIGN</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  `,
})
export class AboutUs {
  private platformId = inject(PLATFORM_ID);
  auth = inject(AuthService);
  
  defaultAvatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop';
  profileImage = signal<string | null>(null);
  
  institutionImage = signal<string>('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7IscYd17D6Z2iO_8G8_S7G6uR-B9Wv5q9_I_o1p8Z7_I_o1p8Z7_I_o1p8Z7_I_o1p8Z/s1600/nueva-sede.jpg');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.profileImage.set(localStorage.getItem('about_profile_image'));
      const savedInst = localStorage.getItem('institution_image');
      if (savedInst) this.institutionImage.set(savedInst);
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const profilImg = this.profileImage();
        if (profilImg) localStorage.setItem('about_profile_image', profilImg);
        
        localStorage.setItem('institution_image', this.institutionImage());
      }
    });
  }

  onProfileFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onInstitutionFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.institutionImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}
