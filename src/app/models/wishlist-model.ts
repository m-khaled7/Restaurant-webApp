import { ProductModel } from './product-model';

export interface WishlistModel {
  items: WishlistItem[];
  count: number;
}

export interface WishlistItem {
  _id: string;
  user: string;
  product: ProductModel;
  createdAt: string; // or Date if you convert it
  __v: number;
}
