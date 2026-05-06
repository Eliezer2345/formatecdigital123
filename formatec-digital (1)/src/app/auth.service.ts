import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuditService } from './audit.service';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'formatec_users';
  private readonly AUTH_KEY = 'formatec_current_user';
  private platformId = inject(PLATFORM_ID);

  private currentUser = signal<User | null>(null);
  private users = signal<User[]>([]);
  private verificationCode = signal<string | null>(null);
  private loginAttempts = signal<number>(0);
  private lockoutTime = signal<number | null>(null);

  auditService = inject(AuditService);
  user = this.currentUser.asReadonly();
  attempts = this.loginAttempts.asReadonly();
  lockoutRemaining = signal<number>(0);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
      this.checkLockout();
    }
    
    // Persist current user changes
    effect(() => {
      const user = this.currentUser();
      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.AUTH_KEY);
        }
      }
    });

    // Persist users list changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users()));
      }
    });
  }

  private checkLockout() {
    const storedLockout = localStorage.getItem('formatec_lockout');
    if (storedLockout) {
      const time = parseInt(storedLockout);
      if (time > Date.now()) {
        this.lockoutTime.set(time);
        this.startLockoutTimer(time);
      } else {
        localStorage.removeItem('formatec_lockout');
      }
    }
  }

  private startLockoutTimer(until: number) {
    const update = () => {
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining > 0) {
        this.lockoutRemaining.set(remaining);
        setTimeout(update, 1000);
      } else {
        this.lockoutRemaining.set(0);
        this.lockoutTime.set(null);
        this.loginAttempts.set(0);
        localStorage.removeItem('formatec_lockout');
      }
    };
    update();
  }

  private loadInitialData() {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
    } else {
      // Default Admin
      this.users.set([
        { 
          id: 1, 
          name: 'Administrador', 
          email: 'admin@formatec.com', 
          role: 'admin', 
          password: 'admin123',
          profileImage: ''
        }
      ]);
    }

    const storedAuth = localStorage.getItem(this.AUTH_KEY);
    if (storedAuth) {
      this.currentUser.set(JSON.parse(storedAuth));
    }
  }

  login(email: string, password: string): string | null {
    if (this.lockoutTime() && this.lockoutTime()! > Date.now()) {
      return null;
    }

    const foundUser = this.users().find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      this.loginAttempts.set(0);
      // Generate 6-digit code for 2FA
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this.verificationCode.set(code);
      console.log('Verification Code (Simulated):', code);
      this.auditService.log(email, 'Intento de Login (Paso 1: Credenciales)', 'Exitoso');
      return code;
    } else {
      this.loginAttempts.update(n => n + 1);
      this.auditService.log(email, `Intento de Login fallido (Intento ${this.loginAttempts()})`, 'Error');
      
      if (this.loginAttempts() >= 3) {
        const lockoutUntil = Date.now() + 30000; // 30 seconds
        this.lockoutTime.set(lockoutUntil);
        localStorage.setItem('formatec_lockout', lockoutUntil.toString());
        this.startLockoutTimer(lockoutUntil);
        this.auditService.log(email, 'Usuario bloqueado por 30 segundos', 'Error');
      }
      return null;
    }
  }

  verifyCode(email: string, code: string): boolean {
    if (this.verificationCode() === code) {
      const foundUser = this.users().find(u => u.email === email);
      if (foundUser) {
        this.currentUser.set(foundUser);
        this.verificationCode.set(null);
        this.auditService.log(foundUser.name, 'Sesión iniciada (2FA verificado)', 'Exitoso');
        return true;
      }
    }
    this.auditService.log(email, 'Código de verificación incorrecto', 'Error');
    return false;
  }

  logout() {
    const user = this.currentUser();
    if (user) {
      this.auditService.log(user.name, 'Sesión cerrada manualmente', 'Exitoso');
    }
    this.currentUser.set(null);
  }

  register(user: Partial<User>) {
    const existingUser = this.users().find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('Este correo ya está registrado');
    }

    const newUser: User = {
      ...user as User,
      id: Date.now(),
      role: 'user',
      profileImage: user.profileImage || ''
    };
    this.users.update(users => [...users, newUser]);
    return newUser;
  }

  completeLogin(email: string) {
    const foundUser = this.users().find(u => u.email === email);
    if (foundUser) {
      this.currentUser.set(foundUser);
    }
  }

  updateProfile(updatedData: Partial<User>) {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...updatedData };
      this.currentUser.set(updated);
      this.users.update(users => users.map(u => u.id === updated.id ? updated : u));
    }
  }

  uploadProfileImage(base64: string) {
    this.updateProfile({ profileImage: base64 });
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  // Admin methods
  getUsers() {
    return this.users.asReadonly();
  }

  addUser(user: User) {
    this.users.update(users => [...users, { ...user, id: Date.now(), password: user.password || '123456' }]);
  }

  updateUser(updatedUser: User) {
    this.users.update(users => users.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    // If we updated the logged-in user, update the current user signal too
    if (this.currentUser()?.id === updatedUser.id) {
      this.currentUser.set({ ...this.currentUser()!, ...updatedUser });
    }
  }

  deleteUser(id: number) {
    if (this.currentUser()?.id === id) return; // Prevent self-delete
    this.users.update(users => users.filter(u => u.id !== id));
  }
}
