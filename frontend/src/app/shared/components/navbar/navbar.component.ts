import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule],
  template: `
    <header class="topbar">
      <div class="topbar__inner">
        <a class="brand" routerLink="/">
          <strong>Portfolio</strong>
        </a>

        <ng-container *ngIf="authService.currentUser$ | async as user; else loginButtons">
          <nav class="nav-links">
            <a mat-button routerLink="/projects" routerLinkActive="is-active">Проєкти</a>
            <a mat-button routerLink="/orders" routerLinkActive="is-active">Замовлення</a>
          </nav>

          <div class="account-summary">
            <span class="account-summary__name">{{ user.fullName }}</span>
            <span class="account-summary__role">{{ user.roleName }}</span>
          </div>

          <button mat-stroked-button type="button" (click)="logout()">Вийти</button>
        </ng-container>

        <ng-template #loginButtons>
          <div class="guest-actions">
            <a mat-button routerLink="/login" routerLinkActive="is-active">Увійти</a>
            <a mat-flat-button routerLink="/register">Реєстрація</a>
          </div>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .topbar {
      padding: 1rem 1rem 0;
    }

    .topbar__inner {
      max-width: 1180px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--app-border);
      border-radius: 12px;
      background: #fff;
    }

    .brand {
      margin-right: auto;
      font-size: 1rem;
      font-weight: 600;
    }

    .nav-links,
    .guest-actions {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .nav-links a.is-active,
    .guest-actions a.is-active {
      background: rgba(37, 53, 46, 0.08);
    }

    .account-summary {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.1rem;
      margin-left: auto;
      padding: 0 0.2rem;
    }

    .account-summary__name {
      font-size: 0.92rem;
      font-weight: 600;
    }

    .account-summary__role {
      color: var(--app-muted);
      font-size: 0.74rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @media (max-width: 900px) {
      .topbar__inner {
        flex-wrap: wrap;
      }

      .nav-links {
        order: 3;
        width: 100%;
        overflow-x: auto;
      }

      .account-summary {
        align-items: start;
      }
    }

    @media (max-width: 640px) {
      .account-summary {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
