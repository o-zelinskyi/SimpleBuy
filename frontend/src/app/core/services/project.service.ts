import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProjectResponseDto, 
  CreateProjectDto, 
  UpdateProjectDto 
} from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectResponseDto[]> {
    return this.http.get<ProjectResponseDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProjectResponseDto> {
    return this.http.get<ProjectResponseDto>(`${this.apiUrl}/${id}`);
  }

  create(project: CreateProjectDto): Observable<ProjectResponseDto> {
    return this.http.post<ProjectResponseDto>(this.apiUrl, project);
  }

  update(id: number, project: UpdateProjectDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
