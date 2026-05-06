import { Injectable, signal, PLATFORM_ID, inject, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private theme = signal<Theme>('light');
  currentTheme = this.theme.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('formatec_theme') as Theme;
      if (savedTheme) {
        this.theme.set(savedTheme);
        this.applyTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme.set('dark');
        this.applyTheme('dark');
      }
    }

    effect(() => {
      const t = this.theme();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('formatec_theme', t);
        this.applyTheme(t);
      }
    });
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private applyTheme(theme: Theme) {
    if (isPlatformBrowser(this.platformId)) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
    }
  }
}
