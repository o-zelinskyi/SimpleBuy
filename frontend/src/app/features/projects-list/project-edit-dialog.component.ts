import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectService } from '../../core/services';
import { ProjectResponseDto } from '../../core/models';

@Component({
  selector: 'app-project-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <span class="dialog-kicker">Редагування</span>
      <span>Оновити проєкт</span>
    </h2>
    <mat-dialog-content>
      <p class="dialog-copy">Змініть ключові поля та збережіть оновлену версію проєкту.</p>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Назва</mat-label>
        <input matInput [(ngModel)]="title">
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Опис</mat-label>
        <textarea matInput [(ngModel)]="description" rows="4"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Ціна</mat-label>
        <input matInput type="number" [(ngModel)]="price">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Скасувати</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="isLoading">
        Зберегти
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
    }
    mat-dialog-content {
      min-width: min(30rem, calc(100vw - 3rem));
    }
  `]
})
export class ProjectEditDialogComponent {
  title: string;
  description: string;
  price: number;
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectResponseDto,
    private projectService: ProjectService
  ) {
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
  }

  save(): void {
    this.isLoading = true;
    this.projectService.update(this.data.id, {
      title: this.title,
      description: this.description,
      price: this.price
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
