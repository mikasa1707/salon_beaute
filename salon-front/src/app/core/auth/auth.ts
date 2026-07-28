import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environnements/environnement';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private key = 'auth_user';
  private readonly tokenKey = 'access_token';

  login(dto: any) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.setUser(res.user);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUser() {
    const data = localStorage.getItem(this.key);

    return data ? JSON.parse(data) : null;
  }

  setUser(user: any) {
    localStorage.setItem(this.key, JSON.stringify(user));
  }

  clear() {
    localStorage.removeItem(this.key);
    localStorage.removeItem('access_token');
  }
}
