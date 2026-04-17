export interface Order {
  id: number;
  projectId: number;
  projectTitle: string;
  projectPrice: number;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  createdAt: string;
  status: string;
}

export interface CreateOrderDto {
  projectId: number;
  buyerId: number;
}

export interface UpdateOrderStatusDto {
  status: string;
}
