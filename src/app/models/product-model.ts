export interface ProductModel {
    _id: string;
  name: string;
  price: number;
  subcategoryId: string;
  image: string[]; 
  sizes: string[]; 
  description: string;
  offerId: string;
  discountedPrice: number;
  quantity: number;
  createdAt: string; 
  updatedAt: string; 
  __v: number;  
}

