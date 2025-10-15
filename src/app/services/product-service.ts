import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient) {}

 getProducts(filters: any = {}): Observable<any> {
  let params = new HttpParams();

  Object.keys(filters).forEach(key => {
    const v = filters[key];
    if (Array.isArray(v)) {
      v.forEach(item => {
        params = params.append(key, String(item));
      });
    } else if (v !== null && v !== undefined && v !== '') {
      params = params.set(key, String(v));
    }
  });

  return this._HttpClient.get(this.apiUrl + '/products', { params });
}


  productDetails(ID:string): Observable<any>{
    return this._HttpClient.get(this.apiUrl + '/products/'+ID);
  }

  getAuthHeaderOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('userToken');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return { headers: headers };
    }

    return { headers: new HttpHeaders() };
  }

  getSubcategories(): Observable<any>{
    return this._HttpClient.get(this.apiUrl + '/products/get-subcategories');
  }

  getReviews(ID:string): Observable<any>{
    return this._HttpClient.get(this.apiUrl + '/user/get-reviews/'+ID,this.getAuthHeaderOptions());
  }
}
