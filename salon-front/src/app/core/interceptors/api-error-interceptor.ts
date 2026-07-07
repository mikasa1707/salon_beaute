import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../core/services/toast';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(error => {
      let message = 'Une erreur est survenue';

      if (error.status === 0) {
        message = 'Serveur inaccessible';
      }
      if (error.status === 400) {
        message = 'Données invalides';
      }
      if (error.status === 401) {
        message = 'Session expirée';
      }
      if (error.status === 404) {
        message = 'Ressource introuvable';
      }
      if (error.status >= 500) {
        message = 'Erreur serveur';
      }

      toast.error(message);
      return throwError(() => error);
    })
  );
};