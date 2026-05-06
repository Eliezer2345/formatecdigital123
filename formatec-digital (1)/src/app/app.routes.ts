import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Home } from './home';
import { Register } from './register';
import { Login } from './login';
import { Courses } from './courses';
import { Profile } from './profile';
import { AboutUs } from './about-us';
import { CourseContent } from './course-content';
import { Contact } from './contact';
import { Blog } from './blog';
import { BlogDetail } from './blog-detail';
import { Diplomas } from './diplomas';
import { ExamComponent } from './exam';
import { AdminDashboard, AdminStats } from './admin';
import { AuditPanel } from './audit-panel';
import { AdminUsers } from './admin-users';
import { AdminCourses } from './admin-courses';
import { AuthService } from './auth.service';

const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user()) return true;
  return router.parseUrl('/login');
};

const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.user()?.role === 'admin') return true;
  return router.parseUrl('/');
};

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'courses', component: Courses },
  { path: 'diplomas', component: Diplomas, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'about-us', component: AboutUs },
  { path: 'contact', component: Contact },
  { path: 'blog', component: Blog },
  { path: 'blog/:id', component: BlogDetail },
  { path: 'course-content/:id', component: CourseContent },
  { path: 'exam/:courseId/:level', component: ExamComponent },
  { 
    path: 'admin', 
    component: AdminDashboard, 
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminStats },
      { path: 'users', component: AdminUsers },
      { path: 'courses', component: AdminCourses },
      { path: 'audit', component: AuditPanel }
    ]
  },
  { path: '**', redirectTo: '' }
];
