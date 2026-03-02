import { Product } from "./Product";

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  department: string;
  country: string;
  phone: string;
}

export interface Order {
  product: Product;
  quantity: number;
  shippingInfo: ShippingInfo;
  subtotal: number;
  baseFee: number;
  shippingFee: number;
  totalAmount: number;
}
