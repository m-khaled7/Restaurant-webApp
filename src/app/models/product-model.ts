export interface ProductModel {
  _id: string;
  name: string;
  price: number;
  subcategoryId: string;
  image: string[];
  sizes: string[];
  description: string;
  offerId: Offer;
  discountedPrice: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface subcategory {
  _id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface subcategories {
  subcategories: subcategory[];
}

export interface Offer {
  _id: string;
  startDate: string;      
  endDate: string;          
  discountPercentage: number;
  createdAt: string;        
  updatedAt: string;          
  __v: number;
}

export interface Offers{
  productsOffers:ProductModel[]
}

export interface _Products {
  results: number;
  totalProducts: number;
  totalPages: number;
  products: ProductModel[];
}

export interface Product {
  product: ProductModel;
  similarProducts:ProductModel[]
}