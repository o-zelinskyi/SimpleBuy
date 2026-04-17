import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService, AuthService } from '../../core/services';
import { ProjectResponseDto } from '../../core/models';
import { ProjectDetailsDialogComponent } from './project-details-dialog.component';
import { ProjectEditDialogComponent } from './project-edit-dialog.component';
import { ProjectCreateDialogComponent } from './project-create-dialog.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent implements OnInit {
  projects: ProjectResponseDto[] = [];
  isLoading = false;
  error: string | null = null;
  displayedColumns: string[] = ['title', 'sellerName', 'price', 'createdAt', 'actions'];

  constructor(
    private projectService: ProjectService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error = 'Не вдалося завантажити проєкти';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openDetails(project: ProjectResponseDto): void {
    this.dialog.open(ProjectDetailsDialogComponent, {
      data: project,
      width: '640px',
      maxWidth: 'calc(100vw - 1.5rem)',
      autoFocus: false
    });
  }

  editProject(project: ProjectResponseDto, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      data: project,
      width: '620px',
      maxWidth: 'calc(100vw - 1.5rem)',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
        this.snackBar.open('Проєкт оновлено', 'OK', { duration: 3000 });
      }
    });
  }

  canAddProject(): boolean {
    return this.authService.isAdmin() || this.authService.isSeller();
  }

  addProject(): void {
    const dialogRef = this.dialog.open(ProjectCreateDialogComponent, {
      width: '620px',
      maxWidth: 'calc(100vw - 1.5rem)',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProjects();
        this.snackBar.open('Проєкт успішно створено', 'OK', { duration: 3000 });
      }
    });
  }

  deleteProject(project: ProjectResponseDto, event: Event): void {
    event.stopPropagation();
    if (confirm(`Видалити проєкт "${project.title}"?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Проєкт видалено', 'OK', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Помилка видалення', 'OK', { duration: 3000 });
        }
      });
    }
  }
}
