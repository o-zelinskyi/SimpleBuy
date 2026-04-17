import { Role } from './role.model';
import { Project } from './project.model';

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  roleID: number;
  role: Role;
  projects: Project[];
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserDto {
  fullName: string;
  roleId: number;
}

export interface UserResponseDto {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  projectsCount: number;
}
