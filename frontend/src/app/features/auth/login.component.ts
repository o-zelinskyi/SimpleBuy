import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <section class="auth-card">
        <header class="auth-card__header">
          <h1>Вхід</h1>
        </header>

        <form (ngSubmit)="onSubmit()">
          <div class="auth-form__stack">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" autocomplete="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Пароль</mat-label>
              <input
                matInput
                type="password"
                [(ngModel)]="password"
                name="password"
                autocomplete="current-password"
                required>
            </mat-form-field>

            <div *ngIf="error" class="auth-error">{{ error }}</div>

            <button mat-flat-button color="primary" type="submit" [disabled]="isLoading" class="auth-submit">
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span>{{ isLoading ? 'Входимо...' : 'Увійти' }}</span>
            </button>
          </div>
        </form>

        <p class="auth-footer">
          Немає акаунта? <a routerLink="/register">Створити профіль</a>
        </p>
      </section>
    </div>
  `,
  styles: [`
    button mat-spinner {
      display: inline-block;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/projects']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Заповніть всі поля';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.error = err.error?.Message || 'Помилка входу';
        this.isLoading = false;
      }
    });
  }
}
