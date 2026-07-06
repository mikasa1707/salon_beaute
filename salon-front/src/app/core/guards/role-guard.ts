import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    let user: any;

    try {
      user = jwtDecode(token);
    } catch (e) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[] | undefined;

    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    if (!expectedRoles.includes(user.role)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
