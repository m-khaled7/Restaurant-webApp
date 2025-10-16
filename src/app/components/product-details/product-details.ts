import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute,RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification-service';
import { ProductService } from '../../services/product-service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Review } from '../review/review';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { ProductModel } from '../../models/product-model';
import {WishlistItem}from "../../models/wishlist-model"
import {cartItem}from "../../models/cart-model"
import { NotFound } from '../not-found/not-found';


@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, Review, NgClass, RouterLink,NotFound],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _Router: Router,
    private _AuthService: AuthService,
    private _UserService: UserService
  ) {}
  productDetails!: ProductModel;
  similarProducts: ProductModel[] = [];
  reviews: any = [];
  userData: any = {};
  user: any = {};
  wishlistIDs: Set<string> = new Set();
  cartIDs: Set<string> = new Set();
  isLogin: boolean = false;
  openMenuFor: string | null = null;
  stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.getData(String(id));
    });
    if (this._AuthService.userData.getValue() != null) {
      this.isLogin = true;
      this._AuthService.userData.subscribe((data: any) => (this.userData = data));
      this.user=JSON.parse(String(localStorage.getItem('user')))
    } else {
      this.isLogin = false;
    }
     if (this.isLogin) {
          this._UserService.wishlist.subscribe({
            next: (w) => {
              this.wishlistIDs = new Set(w?.items?.map((item: WishlistItem) => item.product._id));
            },
          });
          this._UserService.cart.subscribe({
            next: (w) => {
              this.cartIDs = new Set(w?.items?.map((item: cartItem) => item.product._id));
            },
          });
        }
  }

  getData(ID: string) {
    this._ProductService.productDetails(ID).subscribe({
      next: (data) => {
        this.productDetails = data.product;
        this.similarProducts = data.similarProducts;
        this.getReviews(String(ID));
      },
      error: (e) => {
        console.log(e);
        
      },
    });
  }

  getReviews(ID: string) {
    this._ProductService.getReviews(ID).subscribe({
      next: (data) => {
        let reviews = data.reviews;
        this.reviews = reviews.reverse();
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

  handleAddComment(data: { rating: number; comment: string }) {
    let prodID = this._ActivatedRoute.snapshot.params['id'];
    if (this.isLogin) {
      this._UserService.createReview({ productId: prodID, ...data }).subscribe({
        next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
          this.getReviews(prodID);
        },
        error: (e) => {
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
        },
      });
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

  confirmDelete(ID: string) {
    if (this.isLogin) {
      let prodID = this._ActivatedRoute.snapshot.params['id'];
      this._UserService.deleteReview(ID).subscribe({
        next: (data) => {
          this._NotificationService.show('SUCCESS', data.message, 'success');
          this.getReviews(prodID);
        },
        error: (e) => {
          console.log(e);
          if (e.error.message) {
            this._NotificationService.show('ERROR', e.error.message, 'error');
          } else {
            this._NotificationService.show(e.name, e.message, 'error');
          }
        },
      });
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

  toggleMenu(id: string) {
    this.openMenuFor = this.openMenuFor === id ? null : id;
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIDs.has(productId);
  }

  isInCart(productId: string): boolean {
    return this.cartIDs.has(productId);
  }

  wishlist(prodID: string) {
    if (this.isLogin) {
      if (this.isInWishlist(prodID)) {
        this._UserService.deleteFromWishlist(prodID);
      } else {
        this._UserService.addToWishlist(prodID);
      }
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

  cart(prodID: string) {
    if (this.isLogin) {
      if (this.isInCart(prodID)) {
        this._UserService.deleteFromCart(prodID);
      } else {
        this._UserService.addToCart(prodID);
      }
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

  details(ID: string) {
    this._Router.navigate(['/menu', ID]);
  }
}
