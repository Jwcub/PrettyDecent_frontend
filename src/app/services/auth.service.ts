import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterResponse } from '../models/register-response';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  url: string = "https://prettydecent-backend.onrender.com/api";

  token = signal(localStorage.getItem("userToken") || '');
  isLoggedIn = computed(() => this.token());

  // Register account
  register(user: User): Observable<RegisterResponse> {
    const token = localStorage.getItem("userToken");

    // Create header
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    });

    return this.http.post<RegisterResponse>(this.url + "/register", user, { headers });
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

  // log out user
  logout():void {
    this.token.set("");
    localStorage.removeItem("userToken");
    this.router.navigate(['/']);
  }
}
