import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  
  login(dto: any) {
    this.api.login(this.form.value).subscribe({
      next: res => {
        localStorage.setItem('access_token', res.access_token);

        this.auth.setUser(res.user);

        return this.http.post(`${environment.apiUrl}/auth/login`, dto);
      },
    });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  private key = 'auth_user';

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
