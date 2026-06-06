export type UserRole = 'admin' | 'pos' | 'waiter' | 'table';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  createdAt: string;
}

export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  status: 'available' | 'occupied' | 'ordering' | 'preparing' | 'ready' | 'served' | 'paid';
  qrCode: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amountDue: number;
  amountReceived: number;
  change: number;
  status: 'unpaid' | 'partial' | 'paid';
  receiptNumber?: string;
  createdAt: string;
}

export interface DemoResponse {
  message: string;
}
