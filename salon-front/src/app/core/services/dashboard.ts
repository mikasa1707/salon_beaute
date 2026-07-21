import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DashboardResponse } from '../models/dashboard';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class DashboardApi {
  private url = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<DashboardResponse>(this.url);
  }
}
