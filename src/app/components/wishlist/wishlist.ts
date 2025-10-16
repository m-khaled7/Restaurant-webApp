import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {WishlistModel}from "../../models/wishlist-model"
import {cartItem}from "../../models/cart-model"



@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe,NgClass],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  whishlist: WishlistModel | null=null
  cartIDs: Set<string> = new Set();
  constructor(
    private _UserService: UserService,
    private _Router: Router
  ) {}
  ngOnInit(): void {
    this._UserService.wishlist.subscribe({
      next: (data) => {
        this.whishlist = data;
      },
    });
    this._UserService.cart.subscribe({
      next: (w) => {
        this.cartIDs = new Set(w?.items?.map((item: cartItem) => item.product._id));
      },
    });
  }

  deleteItem(ID: string) {
    this._UserService.deleteFromWishlist(ID)
  }

  isInCart(productId: string): boolean {
    return this.cartIDs.has(productId);
  }

  cart(prodID: string) {
    if (this.isInCart(prodID)) {
      this._UserService.deleteFromCart(prodID);
    } else {
      this._UserService.addToCart(prodID);
    }
  }

  details(ID: string) {
    this._Router.navigate(['/menu/' + ID]);
  }
}
