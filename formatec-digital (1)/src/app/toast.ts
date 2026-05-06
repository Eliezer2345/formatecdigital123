import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed top-24 right-5 z-[500] space-y-4 pointer-events-none">
      @for (toast of notification.getToasts()(); track toast.id) {
        <div class="pointer-events-auto flex items-center p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 animate-slide-in"
             [class.bg-emerald-500/10]="toast.type === 'success'"
             [class.border-emerald-500/20]="toast.type === 'success'"
             [class.text-emerald-500]="toast.type === 'success'"
             [class.bg-red-500/10]="toast.type === 'error'"
             [class.border-red-500/20]="toast.type === 'error'"
             [class.text-red-500]="toast.type === 'error'"
             [class.bg-blue-500/10]="toast.type === 'info'"
             [class.border-blue-500/20]="toast.type === 'info'"
             [class.text-blue-500]="toast.type === 'info'">
          <mat-icon class="mr-3">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</mat-icon>
          <span class="text-sm font-bold tracking-tight">{{ toast.message }}</span>
          <button (click)="remove(toast.id)" class="ml-6 p-1 hover:bg-black/5 rounded-lg transition-colors">
            <mat-icon class="!text-sm">close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-slide-in {
      animation: slideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class Toast {
  notification = inject(NotificationService);

  remove(id: number) {
    this.notification.getToasts().update(current => current.filter(t => t.id !== id));
  }
}
