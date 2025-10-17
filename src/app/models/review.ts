import { ProductModel } from './product-model';
import { User } from './user';
export interface Review {
  _id: string;
  rating: number;
  message: string;
  comment: string;
  userId: User;
  productId: string|ProductModel
  createdAt: string;
  updatedAt: string;
  __v: number;

}

export interface Reviews {
  reviews: Review[];
  message:string;
}

export interface testimonial {
  _id: string;
  rating: number;
  message: string;
  comment: string;
  userId: User;
  productId: ProductModel
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface testimonials {
  testimonials:testimonial[]
}
