import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {_Products ,Product, subcategories,Offers} from "../models/product-model"
import {Reviews,testimonials} from "../models/review"


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient) {}

  getProducts(filters: any = {}): Observable<_Products> {
    let params = new HttpParams();

    Object.keys(filters).forEach((key) => {
      const v = filters[key];
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(key, String(v));
      }
    });

    return this._HttpClient.get<_Products>(this.apiUrl + '/products', { params });
  }

  productDetails(ID: string): Observable<Product> {
    return this._HttpClient.get<Product>(this.apiUrl + '/products/' + ID);
  }

  getSubcategories(): Observable<subcategories> {
    return this._HttpClient.get<subcategories>(this.apiUrl + '/products/get-subcategories');
  }

  getReviews(ID: string): Observable<Reviews> {
    return this._HttpClient.get<Reviews>(this.apiUrl + '/user/get-reviews/' + ID);
  }
  
  getTestimonials(): Observable<testimonials> {
    return this._HttpClient.get<testimonials>(this.apiUrl + '/user/testimonials');
  }


  getOffers(): Observable<Offers> {
    return this._HttpClient.get<Offers>(this.apiUrl + '/user/offers');
  }
}
