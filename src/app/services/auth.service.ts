import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterResponse } from '../models/register-response';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  url: string = "http://localhost:5500/api"
  token = signal(localStorage.getItem("userToken") || '');
  isLoggedIn = computed(() => this.token());

  // Register account
  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url + "/register", user);
  }

  // Log in users
  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url + "/login", user).pipe(
      tap(response => {
        this.token.set(response.token);
        localStorage.setItem("userToken", response.token);
      })
    )
  }
}
