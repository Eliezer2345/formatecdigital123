import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [MatIconModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-brand-bg pt-32 pb-20 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <!-- Header -->
        <header class="text-center space-y-6 fade-in max-w-3xl mx-auto">
          <div class="inline-flex items-center px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest rounded-xl">
             Centro de Soporte
          </div>
          <h1 class="text-4xl sm:text-6xl font-bold text-brand-dark tracking-tight leading-tight italic">Contáctanos <span class="text-brand-primary italic">hoy.</span></h1>
          <p class="text-xl text-slate-500 font-medium leading-relaxed">
            ¿Tienes alguna duda o comentario? Nuestro equipo está listo para asistirte en cada paso de tu formación.
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <!-- Contact Form -->
          <div class="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 sm:p-14 fade-in">
            <h2 class="text-2xl font-bold text-brand-dark mb-10 flex items-center">
               Envíanos un mensaje
               <div class="h-1 w-12 bg-brand-primary/20 rounded-full ml-4"></div>
            </h2>
            
            @if (submitted()) {
              <div class="bg-emerald-50 border border-emerald-100 text-emerald-800 p-8 rounded-3xl flex items-center animate-in fade-in slide-in-from-top-4 duration-500">
                <mat-icon class="mr-6 !text-4xl text-emerald-500">verified</mat-icon>
                <div>
                  <p class="font-bold text-xl uppercase tracking-tight">¡Solicitud recibida!</p>
                  <p class="text-sm opacity-90 font-medium leading-relaxed">Un especialista académico se pondrá en contacto contigo en las próximas 24 horas.</p>
                </div>
              </div>
              <button (click)="submitted.set(false)" class="mt-10 text-brand-primary font-bold text-sm tracking-tight hover:underline flex items-center group">
                 Redactar otro mensaje
                 <mat-icon class="ml-2 group-hover:translate-x-2 transition-transform">arrow_forward</mat-icon>
              </button>
            } @else {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-8">
                <div class="space-y-3">
                  <label for="contact-name" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre y Apellidos</label>
                  <input id="contact-name" type="text" formControlName="name" placeholder="Tu nombre completo"
                         class="w-full px-6 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all font-bold text-brand-dark text-sm placeholder:text-slate-300">
                </div>

                <div class="space-y-3">
                  <label for="contact-email" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail corporativo</label>
                  <input id="contact-email" type="email" formControlName="email" placeholder="tu@empresa.com"
                         class="w-full px-6 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all font-bold text-brand-dark text-sm placeholder:text-slate-300">
                </div>

                <div class="space-y-3">
                  <label for="contact-message" class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Describre tu consulta</label>
                  <textarea id="contact-message" formControlName="message" rows="5" placeholder="¿En qué podemos colaborar hoy?"
                            class="w-full px-6 py-4 bg-brand-bg border border-slate-100 rounded-2xl outline-none focus:border-brand-primary focus:bg-white transition-all font-bold text-brand-dark text-sm placeholder:text-slate-300 resize-none"></textarea>
                </div>

                <button type="submit" [disabled]="contactForm.invalid"
                        class="btn-premium !py-5 !text-base shadow-2xl">
                  Tramitar Consulta
                  <mat-icon class="ml-2">send</mat-icon>
                </button>
              </form>
            }
          </div>

          <!-- Info & Map -->
          <div class="lg:col-span-5 space-y-10 fade-in">
            <div class="bg-brand-dark rounded-[2.5rem] p-10 sm:p-12 text-white space-y-12 shadow-2xl relative overflow-hidden group border">
               <!-- Decor -->
               <div class="absolute top-0 right-0 h-48 w-48 bg-brand-primary/10 rounded-full blur-[60px]"></div>

               <div class="space-y-8 relative z-10">
                 <h2 class="text-3xl font-bold tracking-tight">Información de <br><span class="text-brand-primary">Contacto.</span></h2>
                 
                 <div class="space-y-8">
                   <div class="flex items-start space-x-5">
                      <div class="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                         <mat-icon class="text-brand-primary !text-xl">location_on</mat-icon>
                      </div>
                     <div class="space-y-1">
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sede Central</p>
                       <p class="text-slate-200 font-medium">Politécnico Virgen de la Altagracia, RD.</p>
                     </div>
                   </div>
                   
                   <div class="flex items-start space-x-5">
                      <div class="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                         <mat-icon class="text-brand-primary !text-xl">call</mat-icon>
                      </div>
                     <div class="space-y-1">
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Línea Directa</p>
                       <p class="text-slate-200 font-medium">+1 (809) 123-4567</p>
                     </div>
                   </div>

                   <div class="flex items-start space-x-5">
                      <div class="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                         <mat-icon class="text-brand-primary !text-xl">alternate_email</mat-icon>
                      </div>
                     <div class="space-y-1">
                       <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correspondencia</p>
                       <p class="text-slate-200 font-medium italic">contacto&#64;formatecdigital.com</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Map Wrapper -->
            <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden h-72 relative group p-1">
              <iframe 
                src="https://www.google.com/maps?q=Politécnico+Virgen+de+la+Altagracia+Republica+Dominicana&output=embed" 
                class="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 rounded-[2.2rem]" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Contact {
  private fb = new FormBuilder();
  submitted = signal(false);

  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.submitted.set(true);
      this.contactForm.reset();
    }
  }
}
