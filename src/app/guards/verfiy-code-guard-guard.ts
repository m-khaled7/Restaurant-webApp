import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const verifyCodeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('verifyToken');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded) {
        return true;
      }
    } catch (error) {
      return false
    }
  }


  router.navigate(['/home']);
  return false;
};
