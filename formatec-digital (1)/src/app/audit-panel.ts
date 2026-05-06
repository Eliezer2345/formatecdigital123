import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuditService } from './audit.service';
import { FormsModule } from '@angular/forms';

declare const html2pdf: () => { 
  from: (element: HTMLElement) => { 
    set: (opt: {
      margin: number | number[];
      filename: string;
      image: { type: string; quality: number };
      html2canvas: { scale: number; useCORS: boolean; logging: boolean; backgroundColor: string };
      jsPDF: { unit: string; format: string; orientation: string };
    }) => { 
      save: () => void 
    } 
  } 
};

@Component({
  selector: 'app-audit-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="min-h-screen bg-theme-main pt-32 pb-20 px-4 md:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-theme-surface p-10 rounded-[3.5rem] border border-theme shadow-sm relative overflow-hidden">
           <div class="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32"></div>
           
           <div class="space-y-4 relative z-10">
              <div class="inline-flex items-center space-x-2 px-3 py-1 bg-brand-dark text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                 <mat-icon class="!text-sm">security</mat-icon>
                 <span>Sistema de Seguridad</span>
              </div>
              <h1 class="text-4xl md:text-5xl font-black text-theme-main tracking-tighter leading-tight">Panel de <span class="text-brand-primary italic">Auditoría</span></h1>
              <p class="text-theme-muted font-medium max-w-md">Monitoreo en tiempo real de accesos, intentos fallidos e inscripciones de la plataforma.</p>
           </div>

           <div class="flex items-center gap-4 relative z-10">
              <button (click)="exportPDF()" class="px-6 py-3.5 bg-theme-main text-theme-main border border-theme font-black rounded-2xl hover:bg-theme-surface transition-all text-xs uppercase tracking-widest flex items-center shadow-sm">
                 <mat-icon class="mr-2 !text-lg">picture_as_pdf</mat-icon>
                 Exportar PDF
              </button>
              <button (click)="auditService.clearLogs()" class="px-6 py-3.5 bg-red-500/10 text-red-500 font-black rounded-2xl hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest flex items-center border border-red-500/20">
                 <mat-icon class="mr-2 !text-lg">delete_sweep</mat-icon>
                 Limpiar Historial
              </button>
           </div>
        </header>

        <!-- Filters & Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div class="lg:col-span-3 bg-theme-surface p-6 rounded-[2.5rem] border border-theme shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div class="relative flex-1 w-full">
                 <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted">search</mat-icon>
                 <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Buscar por usuario o acción..." 
                        class="w-full pl-12 pr-6 py-3.5 bg-theme-main border border-theme focus:border-brand-primary text-theme-main rounded-2xl outline-none text-sm font-medium transition-all">
              </div>
              <div class="flex items-center gap-4 w-full md:w-auto">
                 <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" class="px-6 py-3.5 bg-theme-main text-theme-main border border-theme rounded-2xl text-xs font-black uppercase tracking-widest outline-none cursor-pointer">
                    <option value="all">Todos los estados</option>
                    <option value="Exitoso">Éxitosos</option>
                    <option value="Error">Errores</option>
                 </select>
              </div>
           </div>
           
           <div class="bg-brand-primary p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-brand-primary/20">
              <div class="space-y-1">
                 <p class="text-[10px] font-black uppercase tracking-widest opacity-60">Total Eventos</p>
                 <p class="text-4xl font-black tracking-tighter">{{ filteredLogs().length }}</p>
              </div>
              <mat-icon class="!text-5xl opacity-20 rotate-12">history</mat-icon>
           </div>
        </div>

        <!-- Audit Table -->
        <div id="audit-table-pdf" class="bg-theme-surface rounded-[3.5rem] border border-theme shadow-sm overflow-hidden transition-all">
           <div class="overflow-x-auto">
              <table class="w-full text-left">
                 <thead>
                    <tr class="bg-theme-main border-b border-theme">
                       <th class="px-8 py-6 text-[10px] font-black text-theme-muted uppercase tracking-widest">Usuario</th>
                       <th class="px-8 py-6 text-[10px] font-black text-theme-muted uppercase tracking-widest">Acción / Evento</th>
                       <th class="px-8 py-6 text-[10px] font-black text-theme-muted uppercase tracking-widest text-center">Estado</th>
                       <th class="px-8 py-6 text-[10px] font-black text-theme-muted uppercase tracking-widest">Fecha & Hora</th>
                       <th class="px-8 py-6 text-[10px] font-black text-theme-muted uppercase tracking-widest text-right">Dispositivo / IP</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-theme">
                    @for (log of filteredLogs(); track log.id) {
                       <tr class="hover:bg-theme-main transition-colors group">
                          <td class="px-8 py-6">
                             <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-theme-main border border-theme flex items-center justify-center text-theme-muted text-xs font-black group-hover:bg-brand-primary group-hover:text-white transition-all">
                                   {{ log.user.charAt(0) }}
                                </div>
                                <span class="font-bold text-theme-main tracking-tight">{{ log.user }}</span>
                             </div>
                          </td>
                          <td class="px-8 py-6">
                             <span class="text-sm font-medium text-theme-muted">{{ log.action }}</span>
                          </td>
                          <td class="px-8 py-6 text-center">
                             <span [class]="'px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ' + 
                                   (log.state === 'Exitoso' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500')">
                                {{ log.state }}
                             </span>
                          </td>
                          <td class="px-8 py-6">
                             <div class="text-[10px] font-bold text-theme-muted uppercase tracking-widest">{{ log.date }}</div>
                             <div class="text-xs font-black text-theme-main">{{ log.time }}</div>
                          </td>
                          <td class="px-8 py-6 text-right">
                             <div class="flex flex-col items-end">
                                <span class="text-xs font-black text-theme-main">{{ log.device }}</span>
                                <span class="text-[9px] font-bold text-theme-muted">{{ log.ip }}</span>
                             </div>
                          </td>
                       </tr>
                    }
                 </tbody>
              </table>
           </div>
           
           @if (filteredLogs().length === 0) {
              <div class="p-20 text-center space-y-4">
                 <mat-icon class="!text-6xl text-slate-200">folder_open</mat-icon>
                 <p class="text-slate-400 font-medium italic">No se encontraron registros que coincidan con los filtros.</p>
              </div>
           }
        </div>
      </div>
    </div>
  `,
})
export class AuditPanel {
  auditService = inject(AuditService);
  
  searchQuery = signal('');
  statusFilter = signal('all');

  filteredLogs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    
    return this.auditService.auditLogs().filter(log => {
      const matchSearch = log.user.toLowerCase().includes(query) || 
                          log.action.toLowerCase().includes(query) ||
                          log.date.toLowerCase().includes(query);
      const matchStatus = status === 'all' || log.state === status;
      return matchSearch && matchStatus;
    });
  });

  exportPDF() {
    const element = document.getElementById('audit-table-pdf');
    if (!element) return;
    
    // Create container for PDF
    const container = document.createElement('div');
    container.style.padding = '40px';
    container.style.backgroundColor = 'white';
    container.style.color = '#0f172a';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Header for PDF
    const header = `
      <div style="margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
           <h1 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">FORMATEC DIGITAL</h1>
           <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 2px;">Reporte de Seguridad</span>
        </div>
        <div style="margin-top: 15px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 800;">Registro de Auditoría de Accesos</h2>
          <p style="color: #64748b; font-size: 12px; margin: 5px 0 0 0;">Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </div>
    `;

    container.innerHTML = header;
    const clonedTable = element.cloneNode(true) as HTMLElement;
    
    // Force styles for PDF (override dark mode classes)
    clonedTable.querySelectorAll('*').forEach((el: Element) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.classList.contains('bg-theme-surface') || htmlEl.classList.contains('bg-theme-main')) {
        htmlEl.style.backgroundColor = 'white';
      }
      if (htmlEl.classList.contains('text-theme-main') || htmlEl.classList.contains('text-theme-muted')) {
        htmlEl.style.color = '#0f172a';
      }
      if (htmlEl.classList.contains('border-theme')) {
        htmlEl.style.borderColor = '#e2e8f0';
      }
      
      // Handle status tags
      if (htmlEl.classList.contains('text-emerald-500')) {
        htmlEl.style.color = '#10b981';
        htmlEl.style.backgroundColor = '#ecfdf5';
      }
      if (htmlEl.classList.contains('text-red-500')) {
        htmlEl.style.color = '#ef4444';
        htmlEl.style.backgroundColor = '#fef2f2';
      }
    });
    
    clonedTable.style.width = '100%';
    clonedTable.style.boxShadow = 'none';
    clonedTable.style.border = '1px solid #e2e8f0';
    clonedTable.style.borderRadius = '20px';
    
    container.appendChild(clonedTable);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Reporte_Formatec_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(container).set(opt).save();
  }
}
