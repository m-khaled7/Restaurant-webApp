
export interface OrderProduct {
  _id: string;
  name: string;
  image: string[];
}

export interface OrderItem {
  product: OrderProduct;
  quantity: number;
  priceAtOrder: number;
  _id: string;
}
export interface ShippingMethod {
    _id: string;
  name: string;
  fee: number;
  estimatedDays: number;
  isActive: boolean;
  createdAt: string;   
  updatedAt: string;   
  __v: number;
}
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string | number;
  country: string;
  phone: string;
}
export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  url:string;
  order:Order
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: ShippingAddress;
  statusHistory: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}
