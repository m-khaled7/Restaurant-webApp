import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient) {}

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach((key) => {
      const v = filters[key];
      if (v !== null && v !== undefined && v !== '') {
        params = params.set(key, String(v));
      }
    });

    return this._HttpClient.get(this.apiUrl + '/products', { params });
  }

  productDetails(ID: string): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/products/' + ID);
  }

  getSubcategories(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/products/get-subcategories');
  }

  getReviews(ID: string): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/user/get-reviews/' + ID);
  }
  getTestimonials(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/user/testimonials');
  }
  getOffers(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/user/offers');
  }
}
