import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProjectResponseDto } from '../../core/models';
import { OrderService, AuthService } from '../../core/services';

@Component({
  selector: 'app-project-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <span class="dialog-kicker">Деталі проєкту</span>
      <span>{{ data.title }}</span>
    </h2>
    <mat-dialog-content>
      <div class="price-banner">
        <span class="price-banner__label">Вартість</span>
        <strong>{{ data.price | currency:'UAH':'symbol':'1.2-2' }}</strong>
      </div>

      <div class="detail-grid">
        <div class="detail-row">
          <strong>ID</strong>
          <span>{{ data.id }}</span>
        </div>
        <div class="detail-row">
          <strong>Продавець</strong>
          <span>{{ data.sellerName }}</span>
        </div>
        <div class="detail-row">
          <strong>Дата створення</strong>
          <span>{{ data.createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
        </div>
      </div>

      <div class="description-block">
        <strong>Опис</strong>
        <p>{{ data.description || 'Опис відсутній' }}</p>
      </div>

      <div *ngIf="orderSuccess" class="success-banner">
        <mat-icon>check_circle</mat-icon>
        Замовлення успішно оформлено!
      </div>
      <div *ngIf="errorMessage" class="error-banner">
        <mat-icon>error</mat-icon>
        {{ errorMessage }}
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(ordered)">Закрити</button>
      <button
        mat-raised-button
        color="primary"
        (click)="placeOrder()"
        [disabled]="!canOrder() || isLoading || orderSuccess">
        <mat-spinner *ngIf="isLoading" diameter="18" style="display:inline-block;margin-right:6px;"></mat-spinner>
        <mat-icon *ngIf="!isLoading && !orderSuccess">shopping_cart</mat-icon>
        <mat-icon *ngIf="orderSuccess">check</mat-icon>
        {{ orderSuccess ? 'Замовлено' : 'Замовити' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: grid;
      gap: 0.35rem;
      padding-bottom: 0;
    }
    .dialog-kicker {
      color: var(--app-muted);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .price-banner {
      padding: 1rem 1.1rem;
      border: 1px solid var(--app-border);
      border-radius: 22px;
      background: rgba(221, 229, 223, 0.5);
      margin-bottom: 1rem;
    }
    .price-banner__label {
      display: block;
      color: var(--app-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .price-banner strong {
      display: block;
      margin-top: 0.35rem;
      font-size: 1.8rem;
      line-height: 1;
    }
    .detail-grid {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.6rem 0;
      border-bottom: 1px solid #eee;
      gap: 1rem;
    }
    .description-block {
      display: grid;
      gap: 0.45rem;
      padding-top: 0.4rem;
    }
    .description-block strong {
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--app-muted);
    }
    .description-block p {
      margin: 0;
      color: #555;
      line-height: 1.7;
    }
    mat-dialog-content {
      min-width: min(32rem, calc(100vw - 3rem));
    }
    .success-banner, .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 16px;
      padding: 10px 14px;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    .success-banner {
      background: var(--app-success-soft);
      color: var(--app-success);
    }
    .error-banner {
      background: var(--app-danger-soft);
      color: var(--app-danger);
    }
    @media (max-width: 640px) {
      .detail-row {
        align-items: start;
        flex-direction: column;
      }
    }
  `]
})
export class ProjectDetailsDialogComponent {
  isLoading = false;
  orderSuccess = false;
  ordered = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectResponseDto,
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  canOrder(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    // Cannot order own project; must be logged in
    return user.id !== this.data.sellerId;
  }

  placeOrder(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.create({
      projectId: this.data.id,
      buyerId: user.id
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.orderSuccess = true;
        this.ordered = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Помилка при оформленні замовлення.';
      }
    });
  }
}
