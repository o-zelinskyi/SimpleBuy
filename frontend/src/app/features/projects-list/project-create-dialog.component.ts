import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../core/services';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-project-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <span class="dialog-kicker">Публікація</span>
      <span>Створити новий проєкт</span>
    </h2>
    <mat-dialog-content>
      <p class="dialog-copy">
        Додайте назву, короткий опис і фінальну ціну. Решту можна оновити пізніше.
      </p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Назва</mat-label>
        <input matInput [(ngModel)]="title" placeholder="Введіть назву проєкту">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Опис</mat-label>
        <textarea matInput [(ngModel)]="description" rows="4" placeholder="Введіть опис проєкту"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Ціна (грн)</mat-label>
        <input matInput type="number" [(ngModel)]="price" placeholder="0.00" min="0">
      </mat-form-field>

      <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Скасувати</button>
      <button mat-raised-button color="primary" (click)="create()" [disabled]="isLoading || !isValid()">
        <mat-spinner *ngIf="isLoading" diameter="18" style="display:inline-block; margin-right:6px;"></mat-spinner>
        Створити
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
    .dialog-copy {
      margin-bottom: 1rem;
      color: var(--app-muted);
      line-height: 1.6;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
      display: block;
    }
    mat-dialog-content {
      min-width: min(30rem, calc(100vw - 3rem));
      padding-top: 8px !important;
    }
    .error-msg {
      color: var(--app-danger);
      font-size: 0.85rem;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ProjectCreateDialogComponent {
  title = '';
  description = '';
  price: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  isValid(): boolean {
    return this.title.trim().length > 0 && (this.price !== null && this.price >= 0);
  }

  create(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.projectService.create({
      title: this.title.trim(),
      description: this.description.trim(),
      price: this.price ?? 0,
      sellerId: currentUser.id
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Помилка при створенні проєкту. Спробуйте ще раз.';
      }
    });
  }
}
