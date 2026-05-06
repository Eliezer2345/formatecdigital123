import { Injectable, signal, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  date: string;
  time: string;
  state: 'Exitoso' | 'Error';
  ip: string;
  device: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'formatec_audit_logs';
  
  private logs = signal<AuditLog[]>([]);
  public auditLogs = this.logs.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.logs.set(JSON.parse(stored));
      }
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs()));
      }
    });
  }

  log(user: string, action: string, state: 'Exitoso' | 'Error' = 'Exitoso') {
    const now = new Date();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      user,
      action,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      state,
      ip: '186.120.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
      device: this.getDeviceSimple(),
      location: this.getSimulatedLocation()
    };
    
    this.logs.update(prev => [newLog, ...prev]);
  }

  private getDeviceSimple(): string {
    if (!isPlatformBrowser(this.platformId)) return 'Servidor';
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Móvil';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Escritorio';
  }

  private getSimulatedLocation(): string {
    const locations = ['Santo Domingo, DO', 'Santiago, DO', 'La Romana, DO', 'Punta Cana, DO', 'Bávaro, DO', 'Puerto Plata, DO'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  clearLogs() {
    this.logs.set([]);
  }
}
