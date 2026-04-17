import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Order } from '../../core/models';
import { OrderService, AuthService } from '../../core/services';

@Component({
  selector: 'app-orders-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;
  error: string | null = null;

  get isAdmin(): boolean { return this.authService.isAdmin(); }
  get isSeller(): boolean { return this.authService.isSeller(); }

  get displayedColumns(): string[] {
    const base = ['id', 'projectTitle', 'price', 'createdAt', 'status'];
    if (this.isAdmin || this.isSeller) base.splice(3, 0, 'buyerName');
    if (this.isAdmin) base.splice(3, 0, 'sellerName');
    if (this.isAdmin || this.isSeller) base.push('actions');
    return base;
  }

  readonly statusLabels: Record<string, string> = {
    Pending:   'Очікує',
    Confirmed: 'Підтверджено',
    Cancelled: 'Скасовано'
  };

  readonly statusOptions = ['Pending', 'Confirmed', 'Cancelled'];

  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.error = null;

    this.orderService.getOrders(user.id, user.roleId).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Не вдалося завантажити замовлення';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pending:   'status-pending',
      Confirmed: 'status-confirmed',
      Cancelled: 'status-cancelled'
    };
    return map[status] ?? '';
  }

  updateStatus(order: Order, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        this.snackBar.open('Статус оновлено', 'OK', { duration: 2500 });
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Помилка оновлення статусу', 'OK', { duration: 2500 });
      }
    });
  }

  canChangeStatus(): boolean {
    return this.isAdmin || this.isSeller;
  }

  countByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  getRoleLabel(): string {
    if (this.isAdmin) return 'Адмін';
    if (this.isSeller) return 'Продавець';
    return 'Покупець';
  }

  getRoleBadgeClass(): string {
    if (this.isAdmin) return 'role-badge badge-admin';
    if (this.isSeller) return 'role-badge badge-seller';
    return 'role-badge badge-buyer';
  }
}
