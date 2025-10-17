import { ProductModel } from './product-model';

export interface CartModel {
  _id: string;
  user: string;
  items: cartItem[];
  message:string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalPrice: number;
}

export interface cartItem{
_id: string;
      product: ProductModel;
      priceAtAdd: number;
      quantity: number;
}