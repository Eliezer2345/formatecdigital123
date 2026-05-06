import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuditService } from './audit.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private auditService = inject(AuditService);

  private timeoutSeconds = 300; // 5 minutes
  private timer: ReturnType<typeof setTimeout> | undefined;

  init() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', () => this.resetTimer());
      window.addEventListener('click', () => this.resetTimer());
      window.addEventListener('keydown', () => this.resetTimer());
      window.addEventListener('scroll', () => this.resetTimer());
    });

    this.startTimer();
  }

  private resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  private startTimer() {
    this.timer = setTimeout(() => {
      this.zone.run(() => {
        if (this.authService.user()) {
          this.auditService.log(this.authService.user()?.name || 'Usuario', 'Sesión cerrada por inactividad');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    }, this.timeoutSeconds * 1000);
  }
}
