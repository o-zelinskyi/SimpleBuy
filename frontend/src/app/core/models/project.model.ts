import { User } from './user.model';

export interface Project {
  id: number;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  sellerId: number;
  seller: User;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  price: number;
  sellerId: number;
}

export interface UpdateProjectDto {
  title: string;
  description: string;
  price: number;
}

export interface ProjectResponseDto {
  id: number;
  title: string;
  price: number;
  description: string;
  createdAt: string;
  sellerId: number;
  sellerName: string;
}
