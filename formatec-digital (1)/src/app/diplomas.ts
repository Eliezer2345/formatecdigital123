import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseService, Course } from './course.service';
import { AuthService } from './auth.service';
import { RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-diplomas',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div class="max-w-7xl mx-auto space-y-12">
        <header class="text-center space-y-4">
          <h1 class="text-4xl md:text-6xl font-black text-brand-dark tracking-tight">Mis <span class="text-brand-primary">Certificaciones</span></h1>
          <p class="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Aquí encontrarás los diplomas oficiales de los cursos que has completado al 100%.
          </p>
        </header>

        @if (completedCourses().length === 0) {
          <div class="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-100 space-y-8 animate-in fade-in">
             <div class="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                <mat-icon class="!text-6xl">workspace_premium</mat-icon>
             </div>
             <div class="space-y-4">
               <h3 class="text-2xl font-black text-brand-dark">Aún no tienes diplomas</h3>
               <p class="text-slate-400 font-medium max-w-sm mx-auto">
                 Completa el 100% de cualquier curso para desbloquear tu certificado oficial con validez internacional.
               </p>
             </div>
             <a routerLink="/courses" class="inline-flex items-center px-10 py-4 bg-brand-primary text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-brand-primary/20">
               Explorar Cursos
             </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (course of completedCourses(); track course.id) {
              <div class="bg-theme-surface rounded-[3rem] overflow-hidden border border-theme shadow-sm hover:shadow-2xl transition-all group p-8 space-y-6">
                <div class="aspect-[1.4/1] bg-slate-900 rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center text-center p-6 text-white group-hover:scale-[1.02] transition-transform duration-500">
                   <img [src]="course.image" [alt]="course.title" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity">
                   <div class="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                   <div class="relative z-10">
                     <mat-icon class="text-brand-primary !text-5xl mb-4">school</mat-icon>
                     <h4 class="text-xl font-black mb-2">{{ course.title }}</h4>
                     <p class="text-[10px] uppercase font-bold tracking-widest text-slate-300">Certificado de Logro</p>
                   </div>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-black text-theme-muted uppercase tracking-widest">Estado</span>
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Completado</span>
                  </div>
                  <div class="grid grid-cols-1">
                    <button (click)="printDiploma(course)" 
                            class="py-4 bg-brand-primary text-white font-black rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center group/btn shadow-xl shadow-brand-primary/20">
                      <mat-icon class="mr-2 group-hover/btn:scale-110 transition-transform">print</mat-icon>
                      Imprimir Certificado
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Hidden Certificate Template for PDF Generation -->
        <div id="certificate-template" class="fixed -left-[9999px] top-0">
          <div id="pdf-content" class="w-[1122px] h-[793px] bg-white relative overflow-hidden font-sans flex shadow-none">
              <!-- Left Sidebar - Academic Navy/Teal -->
              <div class="w-[280px] bg-[#0f172a] h-full flex flex-col items-center p-12 text-white relative flex-shrink-0">
                <!-- Abstract Pattern Background -->
                <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #334155 10px, #334155 11px);"></div>
                
                <!-- Logo/Icon Area -->
                <div class="relative z-10 w-40 h-40 bg-white/10 backdrop-blur-md rounded-full flex flex-col items-center justify-center border-4 border-white/20 shadow-2xl mb-12 mt-8">
                   <mat-icon class="!text-7xl text-[#00A89F]">verified</mat-icon>
                   <div class="mt-2 text-[10px] font-black uppercase tracking-widest text-[#00A89F]">VERIFICADO</div>
                </div>
                
                <div class="relative z-10 text-center space-y-6">
                  <div class="space-y-1">
                    <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Institucional</p>
                    <h2 class="text-2xl font-black leading-tight tracking-tighter uppercase whitespace-nowrap">{{ platformName() }}</h2>
                  </div>
                  
                  <div class="h-0.5 w-16 bg-[#00A89F] mx-auto"></div>
                  
                  <p class="text-[10px] font-medium leading-relaxed text-slate-400 italic">
                    "La educación es el arma más poderosa para cambiar el mundo"
                  </p>
                </div>

                <div class="mt-auto relative z-10 text-center pb-8">
                  <div class="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Folio de Registro</p>
                    <p class="text-sm font-black text-white tracking-widest">{{ certId() }}</p>
                  </div>
                </div>
              </div>

              <!-- Main Certificate Body -->
              <div class="flex-1 bg-white p-20 relative flex flex-col">
                <!-- Academic Border Frame -->
                <div class="absolute inset-8 border-[3px] border-slate-100 pointer-events-none"></div>
                <div class="absolute inset-10 border border-[#00A89F]/20 pointer-events-none"></div>
                
                <!-- Course Image Watermark -->
                <div class="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none">
                   <img [src]="selectedCourseImage()" class="w-full h-full object-contain grayscale" alt="">
                </div>
                
                <!-- Header Info -->
                <div class="flex justify-between items-start mb-12 relative z-10">
                  <div class="text-left">
                    <h1 class="text-[#0f172a] text-6xl font-black tracking-[0.1em] uppercase leading-none mb-4">Certificado</h1>
                    <p class="text-[#00A89F] text-lg font-black uppercase tracking-[0.3em]">De Acreditación Académica</p>
                  </div>
                  
                  <div class="flex flex-col items-end gap-3">
                    <div class="qr-container p-3 bg-white border border-slate-100 rounded-xl shadow-xl">
                      <img [src]="qrCodeUrl()" class="w-28 h-28" alt="Verificación QR">
                    </div>
                  </div>
                </div>

                <!-- Central Content -->
                <div class="flex-grow flex flex-col justify-center text-center relative z-10 -mt-4">
                  <p class="text-sm font-black text-slate-400 uppercase tracking-[0.5em] mb-10">Se otorga con honor a:</p>
                  
                  <h2 class="text-7xl font-black text-[#0f172a] mb-12 tracking-tight leading-none italic pb-4 border-b-2 border-slate-50">
                    {{ userName() }}
                  </h2>
                  
                  <p class="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Por su desempeño sobresaliente en el programa:</p>
                  
                  <h3 class="text-5xl font-black text-[#0f172a] mb-16 tracking-tight leading-tight px-10">
                    {{ selectedCourseTitle() }}
                  </h3>
                  
                  <div class="max-w-2xl mx-auto py-8 px-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative mb-12 shadow-sm">
                     <p class="text-slate-600 leading-relaxed text-base font-medium">
                       Habiendo completado satisfactoriamente los requisitos curriculares, evaluaciones técnicas y prácticas profesionales con una calificación perfecta de <b>{{ score() }}</b> y una asistencia del <b>100%</b>.
                     </p>
                  </div>

                  <!-- Dates Section -->
                  <div class="flex justify-center gap-24 py-8">
                    <div class="text-center group">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fecha de Ingreso</p>
                      <p class="text-lg font-black text-[#0f172a] tracking-tight">{{ startDate() }}</p>
                      <div class="mt-2 h-0.5 w-8 bg-[#00A89F] mx-auto opacity-40"></div>
                    </div>
                    <div class="text-center group">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fecha de Graduación</p>
                      <p class="text-lg font-black text-[#0f172a] tracking-tight">{{ issueDate() }}</p>
                      <div class="mt-2 h-0.5 w-8 bg-[#00A89F] mx-auto opacity-40"></div>
                    </div>
                  </div>
                </div>

                <!-- Footer: Credentials -->
                <div class="mt-auto pt-10 flex items-end justify-between relative z-10">
                  <div class="space-y-4">
                    <p class="text-lg font-black text-[#0f172a] tracking-tight uppercase border-l-4 border-[#00A89F] pl-4">Equivalente a {{ selectedCourseDuration() }} de Formación</p>
                    <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase pl-5">
                      Validación en: <span class="text-[#0f172a]">formatec.digital/verify?id={{ certId() }}</span>
                    </p>
                  </div>
                  
                  <div class="flex items-center gap-12">
                    <div class="flex flex-col items-center">
                      <img src="https://capacitateparaelempleo.org/img/logo-carlos-slim.svg" alt="Socio" class="h-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                      <span class="text-[8px] font-black text-slate-300 mt-2 tracking-widest">PARTNER ACADÉMICO</span>
                    </div>
                    <div class="h-16 w-px bg-slate-100"></div>
                    <div class="flex flex-col items-end">
                       <img [src]="courseService.getBrandLogo()" alt="Sello" class="h-12 object-contain mb-2">
                       <p class="text-[9px] font-black text-[#00A89F] uppercase tracking-tighter">ENTIDAD EMISORA</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Decorative Elements -->
              <div class="absolute top-0 right-0 w-48 h-48 bg-[#00A89F]/5 opacity-50 rounded-full blur-3xl -mr-24 -mt-24"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-[#00A89F]/10 opacity-50 rounded-full blur-2xl -ml-16 -mb-16"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Diplomas {
  public courseService = inject(CourseService);
  private auth = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  
  completedCourses = signal<Course[]>([]);
  platformName = signal('FORMATEC DIGITAL');
  userName = signal('');
  selectedCourseTitle = signal('');
  selectedCourseImage = signal('');
  selectedCourseDuration = signal('');
  score = signal(10.0);
  qrCodeUrl = signal('');
  issueDate = signal('');
  startDate = signal('');
  certId = signal('');

  constructor() {
    this.completedCourses.set(this.courseService.getCompletedCourses());
    
    const user = this.auth.user();
    if (user) {
       this.userName.set(user.name);
    } else {
       // Check if enrolled but not logged in (enrollData from CourseContent)
       // For now fallback to Name from last enrollment or "Estudiante"
       if (isPlatformBrowser(this.platformId)) {
          const enrollments = JSON.parse(localStorage.getItem('formatec_enrollments') || '{}');
          const lastEnroll = Object.values(enrollments)[0] as { name?: string };
          this.userName.set(lastEnroll?.name || 'Estudiante Formatec');
       }
    }

    const savedName = isPlatformBrowser(this.platformId) ? localStorage.getItem('formatec_name') : null;
    if (savedName) this.platformName.set(savedName);
  }

async printDiploma(course: Course) {
  if (!isPlatformBrowser(this.platformId)) return;

  const certificate = this.courseService.getCertificateForCourse(course.id);

  if (!certificate) {
    if (this.courseService.getCourseProgress(course.id) === 100) {
      this.courseService.generateCertificate(course.id, 10.0);
    } else {
      alert('Debes completar el curso al 100% para obtener tu certificado.');
      return;
    }
  }

  await this.prepareCertificate(course);

  setTimeout(() => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    const cloned = element.cloneNode(true) as HTMLElement;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Certificado - ${course.title}</title>

          <!-- Google Fonts -->
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

          <!-- Tailwind CDN -->
          <script src="https://cdn.tailwindcss.com"></script>

          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 297mm;
              height: 210mm;
              background: white;
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            #cert-wrapper {
              width: 297mm;
              height: 210mm;
              overflow: hidden;
              display: flex;
            }

            @media print {
              body {
                background: white;
              }
            }
          </style>
        </head>

        <body>
          <div id="cert-wrapper">
            ${cloned.outerHTML}
          </div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1200);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

    this.launchConfetti();
  }, 600);
}

  private async prepareCertificate(course: Course) {
    const certificate = this.courseService.getCertificateForCourse(course.id);
    if (!certificate) return;

    this.selectedCourseTitle.set(certificate.courseName);
    this.selectedCourseDuration.set(certificate.duration);
    this.selectedCourseImage.set(course.image);
    this.userName.set(certificate.userName);
    this.certId.set(certificate.id);
    this.score.set(certificate.score);
    
    const completionDate = new Date(certificate.completedAt);
    const startDate = new Date(completionDate);
    startDate.setDate(completionDate.getDate() - 30);
    
    this.issueDate.set(completionDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }));
    this.startDate.set(startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }));
    
    if (isPlatformBrowser(this.platformId)) {
      const qrData = `https://formatec.digital/verify?id=${certificate.id}&user=${encodeURIComponent(certificate.userName)}`;
      const url = await QRCode.toDataURL(qrData, {
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#f8fafc00'
        }
      });
      this.qrCodeUrl.set(url);
    }
  }

  private launchConfetti() {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.7 }
    });
  }
}
