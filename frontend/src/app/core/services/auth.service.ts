import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly storageKey = 'currentUser';
  
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getStoredUser(): AuthUser | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  login(dto: LoginDto): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, dto).pipe(
      tap(user => {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, dto).pipe(
      tap(user => {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.roleId === 1;
  }

  isSeller(): boolean {
    return this.currentUserSubject.value?.roleId === 2;
  }

  isBuyer(): boolean {
    return this.currentUserSubject.value?.roleId === 3;
  }

  canEdit(sellerId: number): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    // Admin може все, Seller - тільки свої
    return user.roleId === 1 || (user.roleId === 2 && user.id === sellerId);
  }

  canDelete(sellerId: number): boolean {
    return this.canEdit(sellerId);
  }
}
