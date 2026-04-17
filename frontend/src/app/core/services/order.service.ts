import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, UpdateOrderStatusDto } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(userId: number, role: number): Observable<Order[]> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('role', role.toString());
    return this.http.get<Order[]>(this.apiUrl, { params });
  }

  create(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, dto);
  }

  updateStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status } as UpdateOrderStatusDto);
  }
}
