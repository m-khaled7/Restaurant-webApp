import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { CurrencyPipe } from '@angular/common';


export interface Product {
  _id: string;
  name: string;
  price: number;
  subcategoryId: string;
  image: string[]; // array of image URLs or paths
  sizes: string[]; // array of size options
  description: string;
  offerId: string;
  discountedPrice: number;
  quantity: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  constructor(
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _AuthService: AuthService,
    private _UserService: UserService
  ) {}

  productsList: Product[] = [];
  isLogin: boolean = false;
  ngOnInit(): void {
    this._AuthService.userData.subscribe({
      next: () => {
        if (this._AuthService.userData.getValue() != null) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      },
    });
    this._ProductService.getProducts().subscribe({
      next: (data) => {
        this.productsList = data.products;
      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });
  }

  details() {
    alert('details');
  }

  wishlist(prodID:string){
    if(this.isLogin){
      this._UserService.addWishlistItem(prodID).subscribe({
        next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
      })
    }else{
          this._NotificationService.show('ERROR', "please Login frist", 'error');

    }
  }
  cart(prodID: string) {
    if(this.isLogin){
    this._UserService.addCart(prodID).subscribe({
      next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });}else{
          this._NotificationService.show('ERROR', "please Login frist", 'error');

    }
  }

    deleteItem(prodID: string) {
    if(this.isLogin){
    this._UserService.deteteWishlistItem(prodID).subscribe({
      next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
      },
      error: (e) => {
        if (e.error.message) {
          this._NotificationService.show('ERROR', e.error.message, 'error');
        } else {
          this._NotificationService.show(e.name, e.message, 'error');
        }
      },
    });}else{
          this._NotificationService.show('ERROR', "please Login frist", 'error');

    }
  }
}
