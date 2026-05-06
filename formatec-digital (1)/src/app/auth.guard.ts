import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.user()) {
    return true;
  }

  // Redirigir al login si no está autenticado, pero guardando la ruta intentada
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
