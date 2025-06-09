export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerNIT: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  status: 'generated' | 'sent' | 'paid';
}

export interface DTERecord {
  id: string;
  customerName: string;
  amount: number;
  status: 'approved' | 'rejected' | 'pending';
  date: string;
  xmlUrl: string;
  pdfUrl: string;
}

export interface PaymentData {
  customerName: string;
  customerNIT: string;
  customerEmail: string;
  paymentMethod: 'card' | 'transfer';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  nit?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}