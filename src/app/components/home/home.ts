import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../services/notification-service';
import { ProductModel } from '../../models/product-model';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe,DatePipe, NgClass } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { Review,testimonial } from '../../models/review';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';
import { WishlistItem } from '../../models/wishlist-model';
import { cartItem } from '../../models/cart-model';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, RouterLink, NgClass,DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  breakpoints = {
    // Mobile devices (<= 767px)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Tablets (>= 768px)
    768: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    // Desktops (>= 1024px)
    1024: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
    1580: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  };
  //for testmoinlaalkflk
  breakpointss = {
    // Mobile devices (<= 767px)
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Tablets (>= 768px)
    768: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    // Desktops (>= 1024px)
    1024: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
  };
  wishlistIDs: Set<string> = new Set();
  cartIDs: Set<string> = new Set();
  productsList: ProductModel[] = [];
  productsOffers:ProductModel[]=[]
  testimonials: testimonial[] = [];
  isLogin: boolean = false;
  openMenuFor: string | null = null;
  stars: number[] = [1, 2, 3, 4, 5];
  constructor(
    private _ProductService: ProductService,
    private _NotificationService: NotificationService,
    private _Router: Router,
    private _UserService:UserService,
    private _AuthService:AuthService

  ){}

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
    this.loadProducts();
    this.getTestimonials();
    this.loadProductsOffers()
  }

  loadProducts() {
    this._ProductService.getProducts().subscribe({
      next: (data) => {
        this.productsList = data.products;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }

  loadProductsOffers(){
    this._ProductService.getOffers().subscribe({
      next: (data) => {
        this.productsOffers = data.productsOffers;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }

  getTestimonials() {
    this._ProductService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data.testimonials;
      },
      error: (e) => {
        this._NotificationService.show('Something wrong', e.name, 'error');
        console.log(e);
      },
    });
  }
  details(ID: string) {
    this._Router.navigate(['/menu/' + ID]);
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

addToCart(prodID:string,size:string){
    this._UserService.addToCart(prodID,size)
    this.toggleMenu(prodID)

  }

  cart(prodID: string) {
    if (this.isLogin) {
      if (this.isInCart(prodID)) {
        this._UserService.deleteFromCart(prodID);
      } else {
         this.toggleMenu(prodID)
      }
    } else {
      this._NotificationService.show('ERROR', 'please Login frist', 'error');
    }
  }

}
