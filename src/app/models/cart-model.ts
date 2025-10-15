import { ProductModel } from './product-model';

export interface CartModel {
  _id: string;
  user: string;
  items: [
    {
      _id: string;
      product: ProductModel;
      priceAtAdd: number;
      quantity: number;
    }
  ];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalPrice: number;
}
