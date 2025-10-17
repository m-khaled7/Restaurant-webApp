import { User } from './user';
export interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: User;
  productId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
