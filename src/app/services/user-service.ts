import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = environment.apiUrl;
  constructor(public _HttpClient: HttpClient) {}

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

  //wishlist methods

  getWishlist(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/wishlist', this.getAuthHeaderOptions());
  }
  deteteWishlistItem(ID: string): Observable<any> {
    return this._HttpClient.delete(this.apiUrl + '/wishlist/' + ID, this.getAuthHeaderOptions());
  }
  addWishlistItem(ID: string): Observable<any> {
    return this._HttpClient.post(this.apiUrl + '/wishlist/' + ID, {}, this.getAuthHeaderOptions());
  }
  clearWishlist(): Observable<any> {
    return this._HttpClient.delete(this.apiUrl + '/wishlist/', this.getAuthHeaderOptions());
  }

  //cart methods

  getCart(): Observable<any> {
    return this._HttpClient.get(this.apiUrl + '/cart', this.getAuthHeaderOptions());
  }

  addCart(ID: string): Observable<any> {
    return this._HttpClient.post(
      this.apiUrl + '/cart/add',
      { productId: ID },
      this.getAuthHeaderOptions()
    );
  }

  deleteCartItem(ID: string): Observable<any> {
    return this._HttpClient.delete(this.apiUrl + '/cart/remove/' + ID, this.getAuthHeaderOptions());
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(this.apiUrl + '/cart/clear', this.getAuthHeaderOptions());
  }

  //orders methods


  //profile methods

  
}
