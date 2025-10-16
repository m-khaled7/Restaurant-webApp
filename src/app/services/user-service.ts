import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { NotificationService } from './notification-service';
import { CartModel } from '../models/cart-model';
import { WishlistModel } from '../models/wishlist-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = environment.apiUrl;
  wishlist = new BehaviorSubject<WishlistModel | null>(null);
  cart = new BehaviorSubject<CartModel | null>(null);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private _NotificationService: NotificationService
  ) {}


  private getAuthHeaderOptions() {
    const token = localStorage.getItem('userToken');
    return {
      headers: token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders(),
    };
  }

 

  //  Wishlist Methods

  getWishlist(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/wishlist`, this.getAuthHeaderOptions());
  }

  addWishlistItem(id: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/wishlist/${id}`, {}, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadWishlist()));
  }

  deleteWishlistItem(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/wishlist/${id}`, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadWishlist()));
  }

  clearWishlist(): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/wishlist`, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadWishlist()));
  }

  loadWishlist(): void {
    if (!this.auth.userData.getValue()) return;
    this.getWishlist().subscribe({
      next: (data) => this.wishlist.next(data),
      error: () => this.wishlist.next(null),
    });
  }

  addToWishlist(prodID: string) {
    this.addWishlistItem(prodID).subscribe({
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }

  deleteFromWishlist(prodID: string) {
    this.deleteWishlistItem(prodID).subscribe({
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }

  //  Cart Methods

  getCart(): Observable<CartModel> {
    return this.http.get<CartModel>(`${this.apiUrl}/cart`, this.getAuthHeaderOptions());
  }

  addCart(id: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/cart/add`, { productId: id }, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadCart()));
  }

  deleteCartItem(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/cart/remove/${id}`, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadCart()));
  }

  updateQuantity(id: string, quantity: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/cart/update/${id}`, { quantity }, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/cart/clear`, this.getAuthHeaderOptions())
      .pipe(tap(() => this.loadCart()));
  }

  loadCart(): void {
    if (!this.auth.userData.getValue()) return;
    this.getCart().subscribe({
      next: (data) => this.cart.next(data),
      error: () => this.cart.next(null),
    });
  }

  addToCart(prodID: string) {
    this.addCart(prodID).subscribe({
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }

  deleteFromCart(prodID: string) {
    this.deleteCartItem(prodID).subscribe({
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }
  //orders
  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/`, this.getAuthHeaderOptions());
  }
  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, data, this.getAuthHeaderOptions());
  }

  paidOrder(ID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/${ID}/mark-paid`, this.getAuthHeaderOptions());
  }

  getShippingMethods(): Observable<any> {
    return this.http.get(`${this.apiUrl}/shipping-method/`, this.getAuthHeaderOptions());
  }

  //  Reviews

  createReview(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/create-review`, data, this.getAuthHeaderOptions());
  }

  deleteReview(ID: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/delete-review/` + ID, this.getAuthHeaderOptions());
  }

  //contact
  contactus(formdata: object): Observable<any> {
    return this.http.post(this.apiUrl + '/auth/contactUs', formdata, this.getAuthHeaderOptions());
  }
}
